Ticker = undefined; // hack

var WORLD = 800;
var SCREEN = 800;
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

var prev = undefined;
var drawAll = function () {
	var x = Date.now();
	var elapsed = 0;
	if (prev === undefined) {
		prev = x;
	} else {
		elapsed = x - prev;
		prev = x;
	}
	_(screens).each(function (screen) {
		screen[1](screen[0],drawing,isDrawing, elapsed);
	});
	window.requestAnimFrame(drawAll);
};

$(function () {
	var viewports = [
		new screenOps($("#gamearea1"), screenTypes[0][0], worldCreator(WORLD), [200,-200], SCREEN, SCREEN)
		], screen;

	var gen = function () {
		//viewport.size(SCREEN);
		screens = _(viewports).map(function (v) {
			var screen = v.size(SCREEN, SCREEN);
			return [v.size(SCREEN, SCREEN), animate(polygons)];
		});
		drawAll();
	};
	
	var load = function (file) {
		$.ajax({
				url: file,
				method: 'get',
				data: {},
				success: function(data) {
					var xx = 0;
					polygons = [];

					_(data.polys).each(function (poly) {

						var _poly = {
							points: _(poly.polygon).map(function (p) { return [Math.floor(p.x), Math.floor(p.y)]; }),
							color: [poly.color.r, poly.color.g, poly.color.b, poly.color.a/255.0]
						};
						polygons.push(_poly);
						var x = $("<span style=\"cursor: pointer\"></span>").appendTo($("#polys"));
						$(x).html(" " + xx);
						x.click((function(w) {
							return function () {
								var l = drawing.length;
								for (var i = 0; i < l; i++) {
									drawing.splice(0,1);
								}
								drawing.push(w);
								drawAll();
							};
							})(xx));
						xx++;
					});
					drawing.splice(0, drawing.length, 0);
					for (var i = 0; i < polygons.length; i++) {
						drawing.push(i);
					}
					gen();
				}
		});
	};

	load("doom.json");

	KeyboardJS.bind.key("r", function () {
		gen();
	});

	KeyboardJS.bind.key("d", function () {
		isDrawing = !isDrawing;
	});
	
	KeyboardJS.bind.key("i", function () {
		SCREEN += 64;
		gen();
	});

	KeyboardJS.bind.key("k", function () {
		SCREEN -= 64;
		gen();
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
			drawAll();
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
	
	KeyboardJS.bind.key("alt + dash", function () {
		currentComposite -= 1;
		if (currentComposite < 0 ) {
			currentComposite = 0;
		}
	});

	KeyboardJS.bind.key("alt + equal", function () {
		currentComposite += 1;
		if (currentComposite >= compositeTypes.length) {
			currentComposite = 0;
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


