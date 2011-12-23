

var WORLD = 800;
var SCREEN = 800;
var GRIDSIZE = 100;

var SCREEN_NUMBER = 0;

var polygons = [];
var drawing = [0];
var compositeTypes = [
  'none','copy','source-over','source-in','source-out','source-atop',
  'destination-over','destination-in','destination-out','destination-atop',
  'lighter','darker','copy','xor'
];
var currentComposite = 0;

var grid = false;
var isDrawing = true;

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
		new screenOps($("#gamearea1"), screenTypes[0][0], worldCreator(WORLD), [200,-200], SCREEN, SCREEN)
		], screen;

	var drawAll = function () {
		if (isDrawing) {
			_(screens).each(function (screen) {
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
				screen.console("F: " + (t2-t1) + " - " + t);
			});
		} else {
			_(screens).each(function (screen) {
				screen.console("Paused");
			});
		}
		window.requestAnimFrame(drawAll);
	};

	var gen = function () {
		//viewport.size(SCREEN);
		screens = _(viewports).map(function (v) {
			return v.size(SCREEN, SCREEN);
		});
		drawAll();
	};
	
	gen();

	$.ajax({
			url: 'out.json',
			method: 'get',
			data: {},
			success: function(data) {
				var xx = 0;
				_(data.polys).each(function (poly) {
					var _poly = {
						points: _(poly.polygon).map(function (p) { return [Math.floor(p.x), Math.floor(p.y)]; }),
						color: [poly.color.r, poly.color.g, poly.color.b, poly.color.a/255.0]
					};
					polygons.push(_poly);
					var x = $("<span></span>").appendTo($("#polys"));
					$(x).html(" " + xx);
					x.hover((function(w) {
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

				gen();
			}
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

	KeyboardJS.bind.key("r", function () {
		SCREEN_NUMBER++;
		if (SCREEN_NUMBER >= screens.length) {
			SCREEN_NUMBER = 0;
		}
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

	window.requestAnimFrame(drawAll);
});


