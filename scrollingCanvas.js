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
            
            var x_zoom = (x2-x1)/width;
            var y_zoom = (y1-y2)/height;

            _console.log("ScrollingCanvas: " + gamescreen.console.util.rect(x1,y1,x2,y2) + " proj onto " + gamescreen.console.util.rect(0,0,width,height));
            _console.log("ScrollingCanvas: Zoom factors: " + gamescreen.console.util.point(x_zoom, y_zoom));
            return {
                draw: function(d) {
                    gamescreen.util.Timer.start("FullCanvas");

                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.fillStyle = bg;
                    ctx.fillRect(0,0,width,height);
                    
                    gamescreen.util.Timer.substart("Draw");
                    ctx.setTransform(x_zoom, 0, 0, y_zoom, -x1, y2);
                    d(c2s, ctx);
                    gamescreen.util.Timer.subend();
                    
                    gamescreen.util.Timer.end();
                },
                console: _console
            };
        }
    };
};



