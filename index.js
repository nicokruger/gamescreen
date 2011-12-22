

var WORLD = 800;
var SCREEN = 200;
var GRIDSIZE = 100;

var SCREEN_NUMBER = 0;

var polygons = [];

var draw = function (c2s, ctx) {
	var canvas = ctx.canvas;
    
	renderlib.util.grid(ctx, "rgb(255,255,255)", c2s, -WORLD, -WORLD, WORLD, WORLD, GRIDSIZE);

	/*for (var i = 0; i < polygons.length; i++) {
		var polygon = polygons[i];
		ctx.fillStyle = "rgba(" + polygon.color[0] + "," + polygon.color[1] + "," + polygon.color[2] + "," + polygon.color[3] + ")";
		ctx.moveTo(c2s.cartesian2screenx(polygon.points[0][0]), c2s.cartesian2screeny(polygon.points[0][1]));
		for (var j = 1; j < polygon.points.length; j++) {
			ctx.lineTo(c2s.cartesian2screenx(polygon.points[j][0]), c2s.cartesian2screeny(polygon.points[j][1]));
		}
		ctx.fill();
    }*/
};

var screenTypes = [
	[renderlib.screens.backingCanvas, "Backing canvas"],
	[renderlib.screens.fullCanvas, "Full canvas"]
];

var worldCreator = function (world) {
	return {
		extents: {
			x1: -world,
			y1: -world,
			x2: world,
			y2: world
		},
		width: world*2,
		height: world*2
	};
};

$(function () {
	var viewports = [
		new screenOps($("#gamearea1"), screenTypes[0][0], worldCreator(WORLD), [512,512], SCREEN, SCREEN)
		//new screenOps($("#gamearea2"), screenTypes[1][0], worldCreator(WORLD), SCREEN)
		], screen;

	var gen = function () {
		//viewport.size(SCREEN);
		screens = _(viewports).map(function (v) {
			return v.size(SCREEN, SCREEN);
		});
		_(screens).each(function (screen) {
			screen.draw(draw);
			screen.console("WORLD: " + WORLD + " - SCREEN: " + SCREEN);
		});
	};
	
	gen();

	$.ajax({
			url: 'out.json',
			method: 'get',
			data: {},
			success: function(data) {
				console.log(data);
				_(data.polys).each(function (poly) {
					var _poly = {
						points: _(poly.polygon).map(function (p) { return [Math.floor(p.x), Math.floor(p.y)]; }),
						color: [poly.color.r, poly.color.g, poly.color.b, poly.color.a]
					};
					polygons.push(_poly);
				});
			}
		});
	KeyboardJS.bind.key("d", function () {
		console.log("d pressed");
		_(screens).each(function (screen) { screen.draw(draw); });
	});

	KeyboardJS.bind.key("i", function () {
		console.log("i pressed");
		SCREEN += 64;
		gen();
	});

	KeyboardJS.bind.key("k", function () {
		console.log("k pressed");
		SCREEN -= 64;
		gen();
	});

	KeyboardJS.bind.key("r", function () {
		SCREEN_NUMBER++;
		if (SCREEN_NUMBER >= screens.length) {
			SCREEN_NUMBER = 0;
		}
		gen();
	});
});


