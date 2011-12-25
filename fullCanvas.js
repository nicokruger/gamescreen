var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist
if (!gamescreen.screens) gamescreen.screens = {};
    
gamescreen.screens.fullCanvas = function(where, game,width,height) {
    var game_width = game.extents.x2 - game.extents.x1 + width;
    var game_height = game.extents.y2 - game.extents.y1 + height;
    
    $(where).width(width);
    $(where).height(height + 60);
    
    var holderdiv = $("<div></div>").appendTo(where);
    holderdiv.width(width);
    holderdiv.height(height);
    holderdiv.css("overflow", "scroll");

    var canvas = $("<canvas class=\"gamecanvas\" width=\"" + game_width + "\" height=\"" + game_height + "\"></canvas></div>").appendTo($(holderdiv));
    
    var console = $('<div class="console2"></div>').appendTo($(where));
    console.width(width);
    
    var ctx = canvas[0].getContext("2d"); // don't like the [0] subscript - some jQuery thing I don't understand?
    
    return {
        cleanup: function() {
            canvas.remove();
            holderdiv.remove();
            console.remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new gamescreen.util.Cartesian2Screen(game.extents.x1 - half_viewportwidth,
                game.extents.y1 - half_viewportheight,
                game.extents.x2 + half_viewportwidth,
                game.extents.y2 + half_viewportheight);
            
            $(holderdiv).scrollLeft(c2s.cartesian2screenx(x1));
            $(holderdiv).scrollTop(c2s.cartesian2screeny(y2));
            
            return {
                draw: function(d) {
                    gamescreen.util.Timer.start("FullCanvas");
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(
                        c2s.cartesian2screenx(x1),
                        c2s.cartesian2screeny(y1),
                        c2s.cartesian2screenx(x2) - c2s.cartesian2screenx(x1),
                        c2s.cartesian2screeny(y2) - c2s.cartesian2screeny(y1)
                    );
                                        
                    gamescreen.util.Timer.substart("Draw");
                    d(c2s, ctx);
                    gamescreen.util.Timer.subend();
                    
                    gamescreen.util.Timer.end();
                },
                console: function (html) {
                    $(console).html(html);
                }

            };
        }
    };
};



