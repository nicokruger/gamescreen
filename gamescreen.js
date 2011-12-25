var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist

var _local = (function () {
	return {
		create: function(where, type, world, centerpoint, width, height){
			var screenCreator = function (where, type, world, width, height) {
				var s = type($(where), world, width, height);

				return {
					create: function (x1, y1, x2, y2) {
						return s.create([], x1, y1, x2, y2);
					},
					cleanup: function () {
						// TODO: remove from the screen list here!

						return s.cleanup();
					}
				};
			};

			this._remove = function () {
				if (typeof(this.sc) !== "undefined") {
					this.sc.cleanup();
				}
			};

			this.size = function (width,height) {
				this._remove();
				this.sc = screenCreator(where, type, world, width, height);
				return this.sc.create(centerpoint[0] - width/2, centerpoint[1] - height/2, centerpoint[0] + width/2, centerpoint[1] + height/2);
			};

			this.move = function (x1, y1, x2, y2) {
				this._remove();
				return this.sc.create(x1, y1, x2, y2);
			};

		},

		world: function (worldsize) {
			return {
				extents: {
					x1: -worldsize,
					y1: -worldsize,
					x2: worldsize,
					y2: worldsize
				},
				width: worldsize*2,
				height: worldsize*2
			};
		},

		createView: function (screen, draw) {
			var realFpsTimeCounter = 0;
			var realFps = -1;
			var prevRealFps;
			var prevTime;
			var prev;

			var drawFunction = function (time) {
				if (time === undefined) {
					return;
				}
				var start = Date.now();
				var x = time;
				var elapsed = 0;
				if (prev === undefined) {
					prev = x;
				} else {
					elapsed = x - prev;
					prev =  x;
				}

				draw(screen, drawing, isDrawing, elapsed);

				var consoleText = "Anim: " + Math.round(1000.0/elapsed, 2);
				if (prevTime !== undefined) {
					consoleText += " Drawing: " + Math.round(1000.0/prevTime, 2);
				}
				prevTime = Date.now() - start;
				realFpsTimeCounter += prevTime;
				realFps++;
				if (realFpsTimeCounter >= 1000) {
					prevRealFps = realFps;
					realFpsTimeCounter = 0;
					realFps = 0;
				}
				if (prevRealFps !== undefined) {
					consoleText += " Real: " + prevRealFps;
				}
				screen.console(consoleText);
					
			};

			return function (time) {
				if (isDrawing) {
					drawFunction(time);
				} else {
					screen.console("Paused");
				}
			};
		}

		//anim: 

	};
})();


gamescreen.createView = _local.createView;
gamescreen.create = _local.create;
gamescreen.world = _local.world;
