var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist
if (!gamescreen.screens) gamescreen.screens = {};
    
gamescreen.screens.scrollingCanvas = function(where, game, width, height, background) {
    var bg = background === undefined ? "#ffffff" : background;
    var game_width = game.extents.x2 - game.extents.x1 + width;
    var game_height = game.extents.y2 - game.extents.y1 + height;
    
    $(where).width(width);
    $(where).height(height + 60);
        
    var holderdiv = $("<div></div>").appendTo(where);
    holderdiv.width(width);
    holderdiv.height(height);
    holderdiv.css("overflow", "hidden");

    var canvas = $("<canvas class=\"gamecanvas\" width=\"" + width + "\" height=\"" + height + "\"></canvas></div>").appendTo($(holderdiv));
    
    var consoleDiv = $('<div></div>').appendTo($(where));
    consoleDiv.width(width);
    var _console = gamescreen.console($(consoleDiv));
            
    
    var ctx = canvas[0].getContext("2d"); // don't like the [0] subscript - some jQuery thing I don't understand?
    
    return {
        cleanup: function() {
            canvas.remove();
            holderdiv.remove();
            consoleDiv.remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new gamescreen.util.Identity(game.extents.x1,
                game.extents.y1,
                game.extents.x2,
                game.extents.y2);
            
            var x_zoom = width/(x2-x1);
            var y_zoom = height/(y1-y2);
            var angle = Math.PI;

            return {
                draw: function(d) {
                    gamescreen.util.Timer.start("FullCanvas");

                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.fillStyle = bg;
                    ctx.fillRect(0,0,width,height);
                    
                    gamescreen.util.Timer.substart("Draw");
                    var t = new Transform();
                    t.translate(-x1,y2);
                    t.scale(x_zoom,y_zoom);

                    ctx.setTransform(t.m[0], t.m[1], t.m[2], t.m[3], t.m[4], t.m[5]);
                    d(c2s, ctx);
                    gamescreen.util.Timer.subend();
                    
                    gamescreen.util.Timer.end();
                },
                console: _console
            };
        }
    };
};



