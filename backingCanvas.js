var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist
if (!gamescreen.screens) gamescreen.screens = {};

gamescreen.screens.backingCanvas = function(where, game, width, height, background) {
    var bg = background === undefined ? "#ffffff" : background;
    var extents_width = game.extents.x2 - game.extents.x1 + width;
    var extents_height = game.extents.y2 - game.extents.y1 + height;
    $(where).width(width);
    $(where).height(height + 60);
    var canvas = $("<canvas class=\"gamecanvas\" width=\"" + width + "\" height=\"" + height + "\"></canvas>").appendTo($(where));
    var canvas_hidden = $("<canvas width=\"" + extents_width +"\" height=\"" + extents_height + "\" style=\"display:none\"></canvas>").appendTo($(where));

    var consoleDiv = $('<div class="console2"></div>').appendTo($(where));
    consoleDiv.width(width);
    var _console = gamescreen.console($(consoleDiv));
    //console.height(height);
    _console.log("BackingCanvas: " + gamescreen.console.util.point(width,height));

    var ctx_front = canvas[0].getContext("2d");
    var ctx_back = canvas_hidden[0].getContext("2d");
    return {
        cleanup: function() {
            canvas.remove();
            canvas_hidden.remove();
            consoleDiv.remove();
        },
                

        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new gamescreen.util.Cartesian2Screen(game.extents.x1 - half_viewportwidth,
                game.extents.y1 - half_viewportheight,
                game.extents.x2 + half_viewportwidth,
                game.extents.y2 + half_viewportheight);
            //_console.frame_log(gamescreen.console.util.rect(x1,y1,x2,y2));
            return  {
                draw: function(d) {

/*                    _console.frame_log(gamescreen.console.util.rect(
                        c2s.cartesian2screeny(x1),
                        c2s.cartesian2screeny(y2),
                        width,
                        height
                    ));
*/
                    gamescreen.util.Timer.start("BackingCanvas");

                    gamescreen.util.Timer.substart("clean back");
                    ctx_back.globalCompositeOperation = "none";
                    ctx_back.fillStyle = bg;
                    ctx_back.fillRect(
                        c2s.cartesian2screenx(x1),
                        c2s.cartesian2screeny(y2),
                        width,
                        height
                    );
                    gamescreen.util.Timer.subend();

                    gamescreen.util.Timer.substart("draw-all");
                    d(c2s, ctx_back);
                    gamescreen.util.Timer.subend();
                    
                    gamescreen.util.Timer.substart("copy to front");
                    ctx_back.globalCompositeOperation = "none";
                    ctx_front.drawImage(ctx_back.canvas,
                        c2s.cartesian2screenx(x1),
                        c2s.cartesian2screeny(y2),
                        width,
                        height,
                        0, 0,
                        width,
                        height);
                    gamescreen.util.Timer.subend();
                    
                    gamescreen.util.Timer.end();
                },

                console: _console
            };
        }
    };
};


