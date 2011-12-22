$(function () {
	var WORLD = 2000;
	var SCREEN = 800;
	var GRIDSIZE = 100;

	var draw = function (c2s, ctx) {
		var canvas = ctx.canvas;
        
        renderlib.util.grid(ctx, "rgb(255,255,255)", c2s, -WORLD, -WORLD, WORLD, WORLD, 100);
	};

	var createView = function(world,screen) {
		var game = {
			extents: {
				x1: -world,
				y1: -world,
				x2: world,
				y2: world
			},
			width: world*2,
			height: world*2
		};

		$("#info").html("WORLD: " + WORLD + " SCREEN: " + SCREEN);
		var s = renderlib.screens.backingCanvas($("#gamearea"), game, SCREEN*2, SCREEN*2).create([], -SCREEN, -SCREEN, SCREEN, SCREEN);
		s.draw(draw);
		return s;
	};

	
	var screen = createView(WORLD,SCREEN);

	KeyboardJS.bind.key("d", function () {
		console.log("d pressed");
		screen.draw(draw);
	});

	KeyboardJS.bind.key("i", function () {
		console.log("i pressed");
		SCREEN += 64;
		if (typeof(screen) !== "undefined") {
			screen.cleanup();
		}
		screen = createView(WORLD,SCREEN);
	});

	KeyboardJS.bind.key("k", function () {
		console.log("k pressed");
		SCREEN -= 64;
		if (typeof(screen) !== "undefined") {
			screen.cleanup();
		}
		screen = createView(WORLD,SCREEN);
	});
});


