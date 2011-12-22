

var WORLD = 2000;
var SCREEN = 200;
var GRIDSIZE = 100;

var SCREEN_NUMBER = 0;

var draw = function (c2s, ctx) {
	var canvas = ctx.canvas;
    
    renderlib.util.grid(ctx, "rgb(255,255,255)", c2s, -WORLD, -WORLD, WORLD, WORLD, GRIDSIZE);
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
		new screenOps($("#gamearea1"), screenTypes[0][0], worldCreator(WORLD), SCREEN)
		//new screenOps($("#gamearea2"), screenTypes[1][0], worldCreator(WORLD), SCREEN)
		], screen;

	var gen = function () {
		//viewport.size(SCREEN);
		screens = _(viewports).map(function (v) {
			return v.size(SCREEN);
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
				console.log("receveived: " + data);
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


