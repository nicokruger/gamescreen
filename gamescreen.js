var screenOps = function(where, type, world, screensize){

	var screenCreator = function (where, type, world, screen) {
		var s = type($(where), world, screen*2, screen*2);

		return {
			create: function (x1, y1, x2, y2) {
				return s.create([], x1, y1, x2, y2);
			},
			cleanup: function () {
				return s.cleanup();
			}
		};
	};

	this._remove = function () {
		if (typeof(this.sc) !== "undefined") {
			this.sc.cleanup();
		}
	};

	this.size = function (size) {
		this._remove();
		this.sc = screenCreator(where, type, world, size);
		return this.sc.create(-size, -size, size, size);
	};

	this.move = function (x1, y1, x2, y2) {
		this._remove();
		return this.sc.create(x1, y1, x2, y2);
	};

};

