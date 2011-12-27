var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist

gamescreen.console = function (where) {
	$(where).attr("class", "console-small");
	var frameInfo = $("<div class=\"console-frameinfo\"></div>").appendTo($(where));
	var permInfo = $("<div class=\"console-permanent\"></div>").appendTo($(where));
	var i = 0;
	return {
		frame_start: function() {
			$(frameInfo).html("");
		},
		frame_end: function() {
			
		},
		frame_log: function(text) {
			//$(frameInfo).html($(frameInfo).html() + "<sptext);
			$("<span class=\"console-frameinfo_entry\">" + text + "</span>").appendTo($(frameInfo));
		},

		large: function() {
			$(where).attr("class", "console-large");
		},

		small: function() {
			$(where).attr("class", "console-small");
		},

		log: function (text) {
			console.log("[C]: " + text);
			$("<span class=\"console-log\">" + "[" + i + "] " + text + "</span>").appendTo($(permInfo));
			//$(permInfo).html($(permInfo).html() + "[" + i + "] " + text + "\n");
			i++;
			$(permInfo).scrollTop(50000); // TODO: magic hack number! figure out how to get height of children
		}
	};
};

gamescreen.console.util = {
	point: function (x,y) {
		return "[" + x + "," + y + "]";
	},

	rect: function(x1,y1,x2,y2) {
		return "[" + x1 + "," + y1 + "]x[" + x2 + "," + y2 + "]";
	}

};