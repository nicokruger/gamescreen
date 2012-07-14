var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist

var _local = (function () {
	var exports = {

		create: function (screen, where, viewSize, worldSize, drawerFunction, background, callbacks) {
			var cpx = (worldSize.extents.x1 + worldSize.extents.x2) / 2.0;
			var cpy = (worldSize.extents.y1 + worldSize.extents.y2) / 2.0;

			var viewport = new internalCreate(where, screen, worldSize, [cpx,cpy], viewSize[0], viewSize[1], background, callbacks);
			return new screenWrapper(viewport, viewSize[0], viewSize[1], drawerFunction, background);
		},

		world: function (x1,y1,x2,y2) {
			if (typeof(y1) === "undefined") {
				var worldsize = x1;
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
			} else {
				return {
					extents: { x1:x1, y1:y1, x2:x2, y2:y2 },
					width: x2-x1,
					height: y2-y1
				};
			}
		}

	};

	var internalCreate = function(where, type, world, centerpoint, viewportWidth, viewportHeight,background, callbacks){
		var self = this;
		var screenWidth = viewportWidth, screenHeight = viewportHeight;
		var screenCreator = function (where, type, world, width, height) {
			var s = type($(where), world, width, height, background, callbacks);

			return _.extend({}, s, {
				create: function (x1, y1, x2, y2, createCallback) {
					var _s = s.create(x1, y1, x2, y2);
					if (typeof(callback) !== "undefined") {
						callback(x1,y1,x2,y2);
					}
					return _s;
				},

				cleanup: function () {
					// TODO: remove from the screen list here!
					return s.cleanup();
				}

			});
		};

		this.remove = function () {
			if (typeof(self.sc) !== "undefined") {
				self.sc.cleanup();
			}
		};

		this.size = function (width,height) {
			self.remove();
			viewportWidth = width; screenWidth = width;
			viewportHeight = height; screenHeight = height;
			self.sc = screenCreator(where, type, world, viewportWidth, viewportHeight,background);
			return self.sc.create(centerpoint[0] - screenWidth/2,
				centerpoint[1] - screenHeight/2,
				centerpoint[0] + screenWidth/2,
				centerpoint[1] + screenHeight/2,
				self.viewChangeCallback);
		};

		this.resize = function (_screenWidth, _screenHeight) {
			screenWidth = _screenWidth;
			screenHeight = _screenHeight;

			return self.sc.create(centerpoint[0] - screenWidth/2,
				centerpoint[1] - screenHeight/2,
				centerpoint[0] + screenWidth/2,
				centerpoint[1] + screenHeight/2, self.viewChangeCallback);
		};

		this.move = function (x,y) {
			centerpoint[0] += x;
			centerpoint[1] += y;

			return self.sc.create(centerpoint[0] - screenWidth/2,
				centerpoint[1] - screenHeight/2,
				centerpoint[0] + screenWidth/2,
				centerpoint[1] + screenHeight/2,
				self.viewChangeCallback);
		};

		this.center = function (x, y) {
			centerpoint[0] = x;
			centerpoint[1] = y;
			return self.sc.create(centerpoint[0] - screenWidth/2,
				centerpoint[1] - screenHeight/2,
				centerpoint[0] + screenWidth/2, centerpoint[1] + screenHeight/2,
				self.viewChangeCallback);
		};

		this.getCenter = function () {
			return centerpoint;
		};

		this.onViewChange = function (callback) {
			self.viewChangeCallback = callback;
		};
	};

	var screenWrapper = function (viewport, width, height, draw, background) {
		var self = this,
			screen = viewport.size(width, height, background),
			realFpsTimeCounter = 0,
			realFps = -1,
			prevRealFps,
			prevTime,
			prev;

		this.draw = function (time) {
			if (!time) {
				time = (new Date()).getTime();
			}
			screen.console.frame_start();
			var cp = viewport.getCenter();
			screen.console.frame_log("S: " + cp[0] + "/" + cp[1]);
			var start = Date.now(),
				x = time,
				elapsed = 0;
			if (prev === undefined) {
				prev = x;
			} else {
				elapsed = x - prev;
				prev =  x;
			}

			screen.draw(_.bind(draw,self,screen));

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
			screen.console.frame_end();
		};

		this.requestFrame = function () {
			console.log("requestFrame");
			window.requestAnimFrame(self.draw);
		};
		this.move = function (x,y) {
			screen = viewport.move(x,y);
		};

		this.size = function(width,height) {
			screen = viewport.size(width,height);
		};
		this.resize = function(width,height) {
			screen = viewport.resize(width,height);
		};
		this.center = function (x,y) {
			screen = viewport.center(x,y);
		};
		this.remove = function() {
			viewport.remove();
		};
		this.onViewChange = function (callback) {
			viewport.onViewChange(callback);
		};
		this.console = screen.console;

		this.requestFrame();
	};


	return exports;
})();


gamescreen.createView = _local.createView;
gamescreen.create = _local.create;
gamescreen.world = _local.world;
