

var WORLD = 2000;
var SCREEN = 200;
var GRIDSIZE = 100;

var SCREEN_NUMBER = 0;

var draw = function (c2s, ctx) {
	var canvas = ctx.canvas;
    
    renderlib.util.grid(ctx, "rgb(255,255,255)", c2s, -WORLD, -WORLD, WORLD, WORLD, GRIDSIZE);
};

var screens = [
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

var screenCreator = function (world, screen) {
	var s = screens[SCREEN_NUMBER][0]($("#gamearea"), world, screen*2, screen*2);

	return {
		create: function (x1, y1, x2, y2) {
			return s.create([], x1, y1, x2, y2);
		},
		cleanup: function () {
			return s.cleanup();
		}
	};
};

var screenOps = function(world, screensize){

		this._remove = function () {
			if (typeof(this.sc) !== "undefined") {
				this.sc.cleanup();
			}
		};

		this.size = function (size) {
			this._remove();
			this.sc = screenCreator(world, size);
			return this.sc.create(-size, -size, size, size);
		};

		this.move = function (x1, y1, x2, y2) {
			this._remove();
			return this.sc.create(x1, y1, x2, y2);
		};

	};

$(function () {
	var viewport = new screenOps(worldCreator(WORLD), SCREEN), screen;
	var gen = function () {
		//viewport.size(SCREEN);
		screen = viewport.size(SCREEN);
		$("#info").html("WORLD: " + WORLD + " - SCREEN: " + SCREEN + " - CANVAS: " + screens[SCREEN_NUMBER][1]);
		screen.draw(draw);
	};
	
	gen();

	KeyboardJS.bind.key("d", function () {
		console.log("d pressed");
		screen.draw(draw);
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


