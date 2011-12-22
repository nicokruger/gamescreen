var screenOps = function(where, type, world, centerpoint, width, height){

	var screenCreator = function (where, type, world, width, height) {
		var s = type($(where), world, width, height);

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

	this.size = function (width,height) {
		this._remove();
		this.sc = screenCreator(where, type, world, width, height);
		return this.sc.create(centerpoint[0] - width/2, centerpoint[1] - height/2, centerpoint[0] + width/2, centerpoint[1] + height/2);
	};

	this.move = function (x1, y1, x2, y2) {
		this._remove();
		return this.sc.create(x1, y1, x2, y2);
	};

};

