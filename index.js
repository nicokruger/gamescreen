Ticker = undefined; // hack

var WORLD = 500;
var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 768;
var GRIDSIZE = 100;

var SCREEN_NUMBER = 0;

var drawing = [0];
var compositeTypes = [
  'none','copy','source-over','source-in','source-out','source-atop',
  'destination-over','destination-in','destination-out','destination-atop',
  'lighter','darker','copy','xor'
];
var currentComposite = 0;

var grid = false;
var isDrawing = true;

var screens = [];

var polygons = [];
var backgroundColor;

var prev;
var drawAll = function (/* time */ time) {
	var x = time;
	var elapsed = 0;
	if (prev === undefined) {
		prev = x;
	} else {
		elapsed = x - prev;
		prev =  x;
	}

	if (prev !== undefined) {
		Tween.tick(elapsed > 0 ? elapsed : 1, false);
	}


	_(screens).each(function (x) {
		x.draw(time);
	});
	window.requestAnimFrame(drawAll);
};

var viewports = [];
$(function () {
	var gen = function () {
		_(viewports).each(function (viewport){
			viewport.remove();
		});

		var _new_viewports = [
			new gamescreen.create($("#gamearea1"), gamescreen.screens.scrollingCanvas, gamescreen.world(WORLD), [200,-200], SCREEN_WIDTH, SCREEN_HEIGHT, background)
			//new gamescreen.create($("#gamearea2"), gamescreen.screens.fullCanvas, gamescreen.world(WORLD), [200,-200], SCREEN_WIDTH, SCREEN_HEIGHT, background)
			//new gamescreen.create($("#gamearea3"), gamescreen.screens.backingCanvas, gamescreen.world(WORLD), [200,-200], SCREEN_WIDTH, SCREEN_HEIGHT, background)
			], screen;
		viewports = _new_viewports;

		//viewport.size(SCREEN);
		screens = _(viewports).map(function (viewport) {
			return gamescreen.createView(viewport, SCREEN_WIDTH, SCREEN_HEIGHT, animate(polygons));
		});
	};
	
	var load = function (file) {
		$.ajax({
				url: file,
				method: 'get',
				data: {},
				success: function(data) {
					var xx = 0;

					background = data.background;
					//background = "#ff00ff";

					polygons = [];

					_(data.polys).each(function (poly) {
						var _poly = {
							points: _(poly.polygon).map(function (p) { return [Math.floor(p.x), Math.floor(p.y)]; }),
							color: [poly.color.r, poly.color.g, poly.color.b, poly.color.a/255.0]
						};
						polygons.push(_poly);
					});
					drawing.splice(0, drawing.length, 0);
					for (var i = 0; i < polygons.length; i++) {
						drawing.push(i);
					}
					gen();
				}
		});
	};

	load("doom_black.json");

	var SCROLL_SPEED = 16;

	KeyboardJS.bind.key("up", function () {
		_(screens).each(function (screen) {
			screen.move(0,SCROLL_SPEED);
		});
	});

	KeyboardJS.bind.key("down", function () {
		_(screens).each(function (screen) {
			screen.move(0,-SCROLL_SPEED);
		});
	});
	
	KeyboardJS.bind.key("left", function () {
		_(screens).each(function (screen) {
			screen.move(-SCROLL_SPEED,0);
		});
	});

	KeyboardJS.bind.key("right", function () {
		_(screens).each(function (screen) {
			screen.move(SCROLL_SPEED,0);
		});
	});

	KeyboardJS.bind.key("r", function () {
		gen();
	});

	KeyboardJS.bind.key("d", function () {
		isDrawing = !isDrawing;
	});
	
	KeyboardJS.bind.key("i", function () {
		SCREEN_WIDTH += 64;
		SCREEN_HEIGHT += 64;
		gen();
	});

	KeyboardJS.bind.key("k", function () {
		SCREEN_WIDTH -= 64;
		SCREEN_HEIGHT -= 64;
		gen();
	});

	KeyboardJS.bind.key("u", function () {
		SCREEN_WIDTH += 64;
		SCREEN_HEIGHT += 64;
		_(screens).map(function (screen) {
			return screen.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
		});
	});
	
	KeyboardJS.bind.key("j", function () {
		SCREEN_WIDTH -= 64;
		SCREEN_HEIGHT -= 64;
		_(screens).each(function (screen) {
			return screen.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
		});
	});
	
	KeyboardJS.bind.key("shift + dash", function () {
		drawing[0] -= 1;
	});

	KeyboardJS.bind.key("shift + equal", function () {
		if (drawing.length != 1) {
			var l = drawing.length;
			for (var i = 0; i < l; i++) {
				drawing.splice(0,1);
			}
			drawing = [0];
		}
		drawing[0] += 1;
	});

	KeyboardJS.bind.key("shift + down", function () {
		drawing.splice(drawing.length-1,1);
	});

	KeyboardJS.bind.key("shift + up", function () {
		if (drawing.length === 0) {
			drawing.splice(0,1);
			drawing.push(0);
			return;
		}
		if (drawing[drawing.length-1] !== undefined && drawing[drawing.length-1] + 1 < polygons.length) {
			drawing.push(drawing[drawing.length-1] !== undefined ? drawing[drawing.length-1]+1 : 0);
		}
	});
	
	KeyboardJS.bind.key("c", function () {
		var l = drawing.length;
		for (var i = 0; i < l; i++) {
			drawing.splice(0,1);
		}
	});

	KeyboardJS.bind.key("a", function () {
		drawing.splice(0, drawing.length, 0);
		for (var i = 0; i < polygons.length; i++) {
			drawing.push(i);
		}
	});

	KeyboardJS.bind.key("g", function () {
		grid = !grid;
	});
	
	KeyboardJS.bind.key("z", function () {
		load("doom.json");
	});
	
	KeyboardJS.bind.key("x", function () {
		gen();
	});

	var consoleFull = false;
	KeyboardJS.bind.key("graveaccent", function () {
		consoleFull = !consoleFull;
		if (consoleFull) {
			_(screens).each(function (screen) {
				screen.console.large();
			});
		} else {
			_(screens).each(function (screen) {
				screen.console.small();
			});
		}
	});
	
	$("#all").click(function () {
		drawing.splice(0, drawing.length, 0);
		for (var i = 0; i < polygons.length; i++) {
			drawing.push(i);
		}
	});
	$("#clear").click(function () {
		var l = drawing.length;
		for (var i = 0; i < l; i++) {
			drawing.splice(0,1);
		}
	});
	$("#composition").change(function () {
		compositionOperation = $("#composition").val();
	});

	$("#file").change(function () {
		load($("#file").val() + ".json");
	});

	window.requestAnimFrame(drawAll);
});


