
var movePoly = function (poly, offsetx, offsety) {
	var newPoly = {};

	var test = { x: 0 };
	//Tween.get(test).wait(100).to({x:50},1000).call(function () { alert("working"); });

	//var TP = 4000;
	newPoly.points = _(poly.points).map(function (p) {
		var np = [p[0] + offsetx, p[1] + offsety];
		
		return np;
	});
	newPoly.color = poly.color;

	return newPoly;
};

var drawPolygonsFlag = true;
KeyboardJS.bind.key("p", function () {
	drawPolygonsFlag = drawPolygonsFlag;
});

var spreadPolygons = function (polygons, spread) {
	var i = 0;
	return _(polygons).map(function (p) {
		var x = 0;
		var y = 0;

		var r = 2*Math.PI/polygons.length * i;

		i++;
		
		var np = movePoly(p, Math.cos(r) * spread, Math.sin(r) * spread);
		_(p.points).chain().zip(np.points).each(function (p) {
			var op = p[0];
			var np = p[1];
			var thisPoly = 5000.0/polygons.length * i;
			Tween.get(np).wait(thisPoly).to({"0": op[0], "1" : op[1]}, 2000, Ease.getPowIn(4));
		});
		return np;
	});
};

var jitterPolygons = function (polygons, distance) {
	return _(polygons).map(function (p) {
		var x = Math.floor(-2000 + Math.random() * distance);
		var y = Math.floor(-2000 + Math.random() * distance);
		return movePoly(p, x, y);
	});
};

var createDrawer = function (polygons) {
		
	return function (screen, drawing, isDrawing, elapsed) {
		var draw = function (c2s, ctx) {
			var canvas = ctx.canvas;

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

			if (drawPolygonsFlag && polygons.length > 0) {
				for (var k = 0; k < drawing.length; k++) {
					drawPolygon(polygons[drawing[k]]);
				}
			}

			if (grid) {
				gamescreen.util.grid(ctx, "rgb(30,30,30)", c2s, -WORLD, -WORLD, WORLD, WORLD, GRIDSIZE);
			}

		};

		if (isDrawing) {
			screen.draw(draw);
		} else {
			screen.console("Paused");
		}
	};
};

var animate = function (polygons) {
	return createDrawer(spreadPolygons(polygons, 800));
};

var drawAll = function () {
	
	window.requestAnimFrame(drawAll);
};

