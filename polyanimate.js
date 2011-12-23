
var movePoly = function (poly, offsetx, offsety) {
	var newPoly = {};

	var test = { x: 0 };
	//Tween.get(test).wait(100).to({x:50},1000).call(function () { alert("working"); });

	var TP = Math.random() * 1000 + 3000;
	//var TP = 4000;
	newPoly.points = _(poly.points).map(function (p) {
		var np = [p[0] + offsetx, p[1] + offsety];
		
		Tween.get(np).wait(1500).to({"0": p[0], "1" : p[1]}, TP /*,Ease.elasticIn*/ /*Ease.getPowIn(3)*/);

		return np;
	});
	newPoly.color = poly.color;

	return newPoly;
};

var jitterPolygons = function (polygons) {
	return _(polygons).map(function (p) {
		var x = Math.floor(-2000 + Math.random() * 4000);
		var y = Math.floor(-2000 + Math.random() * 4000);
		return movePoly(p, x, y);
	});
};

var createDrawer = function (polygons) {
		
	return function (screen, drawing, isDrawing, elapsed) {
		var draw = function (c2s, ctx) {
			var canvas = ctx.canvas;

			if (grid) {
				renderlib.util.grid(ctx, "rgb(30,30,30)", c2s, -WORLD, -WORLD, WORLD, WORLD, GRIDSIZE);
			}

			var drawPolygon = function (polygon) {
				ctx.fillStyle = "rgba(" + polygon.color[0] + "," + polygon.color[1] + "," + polygon.color[2] + "," + polygon.color[3] + ")";
				//ctx.strokeStyle = "#00ff00";
				ctx.beginPath();
				ctx.globalCompositeOperation = compositeTypes[currentComposite];
				ctx.moveTo(c2s.cartesian2screenx(polygon.points[0][0]), c2s.cartesian2screeny(polygon.points[0][1]));
				//console.log("First point: " + polygon.points[0][0] + "," + polygon.points[0][1]);
				for (var j = 1; j < polygon.points.length; j++) {
					ctx.lineTo(c2s.cartesian2screenx(polygon.points[j][0]), c2s.cartesian2screeny(polygon.points[j][1]));
				}
				ctx.lineTo(c2s.cartesian2screenx(polygon.points[0][0]), c2s.cartesian2screeny(polygon.points[0][1]));
				ctx.closePath();
				//ctx.stroke();
				ctx.fill();
			};

			if (polygons.length > 0) {
				for (var k = 0; k < drawing.length; k++) {
					drawPolygon(polygons[drawing[k]]);
				}
			}


		};

		if (isDrawing) {
			var t1 = Date.now();

			screen.draw(draw);
			var t = "";
			if (drawing.length < 5) {
				t = ("Drawing: " + drawing.join(","));
			} else if (drawing.length >= polygons.length) {
				t = ("Drawing all");
			} else {
				t = ("Drawing many");
			}
			t += " Composition: " + compositeTypes[currentComposite];

			var t2 = Date.now();
			screen.console("F: " + (t2-t1) + " - " + t + " E: " + elapsed);

			Tween.tick(elapsed > 0 ? elapsed : 1, false);

		} else {
			screen.console("Paused");
		}
	};
};

var animate = function (polygons) {
	return createDrawer(jitterPolygons(polygons));
};

var drawAll = function () {
	
	window.requestAnimFrame(drawAll);
};

