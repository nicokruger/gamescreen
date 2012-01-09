var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist

var _local = (function () {
	return {
		create: function(where, type, world, centerpoint, viewportWidth, viewportHeight,background){
			var screenWidth = viewportWidth, screenHeight = viewportHeight;
			var screenCreator = function (where, type, world, width, height) {
				var s = type($(where), world, width, height, background);

				return {
					create: function (x1, y1, x2, y2) {
						var _s = s.create([], x1, y1, x2, y2);
						return _s;
					},

					cleanup: function () {
						// TODO: remove from the screen list here!

						return s.cleanup();
					}

				};
			};

			this.remove = function () {
				if (typeof(this.sc) !== "undefined") {
					this.sc.cleanup();
				}
			};

			this.size = function (width,height) {
				this.remove();
				viewportWidth = width; screenWidth = width;
				viewportHeight = height; screenHeight = height;
				this.sc = screenCreator(where, type, world, viewportWidth, viewportHeight,background);
				return this.sc.create(centerpoint[0] - screenWidth/2,
					centerpoint[1] - screenHeight/2,
					centerpoint[0] + screenWidth/2,
					centerpoint[1] + screenHeight/2, background);
			};

			this.resize = function (_screenWidth, _screenHeight) {
				screenWidth = _screenWidth;
				screenHeight = _screenHeight;

				return this.sc.create(centerpoint[0] - screenWidth/2,
					centerpoint[1] - screenHeight/2,
					centerpoint[0] + screenWidth/2,
					centerpoint[1] + screenHeight/2, background);
			};

			this.move = function (x,y) {
				centerpoint[0] += x;
				centerpoint[1] += y;

				return this.sc.create(centerpoint[0] - screenWidth/2, centerpoint[1] - screenHeight/2, centerpoint[0] + screenWidth/2, centerpoint[1] + screenHeight/2, background);
			};

			this.center = function (x1, y1, x2, y2) {
				return this.sc.create(x1, y1, x2, y2, background);
			};

			this.getCenter = function () {
				return centerpoint;
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

		createView: function (viewport, width, height, draw, background) {
			var screen = viewport.size(width, height, background);

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

				draw(screen, elapsed);

				screen.console.frame_log("Anim: " + Math.round(1000.0/elapsed, 2));
				if (prevTime !== undefined) {
					screen.console.frame_log(" Drawing: " + Math.round(1000.0/prevTime, 2));
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
					screen.console.frame_log(" Real: " + prevRealFps);
				}
					
			};

			return {
				draw: function (time) {
					screen.console.frame_start();
					var cp = viewport.getCenter();
					screen.console.frame_log("S: " + cp[0] + "/" + cp[1]);
					drawFunction(time);
					screen.console.frame_end();
				},
				move: function (x,y) {
					//screen = viewport.move(x1,y1,x2,y2);
					screen = viewport.move(x,y);
				},
				size: function(width,height) {
					screen = viewport.size(width,height);
				},
				resize: function(width,height) {
					screen = viewport.resize(width,height);
				},
				console: screen.console
			};
		}

	};
})();


gamescreen.createView = _local.createView;
gamescreen.create = _local.create;
gamescreen.world = _local.world;
