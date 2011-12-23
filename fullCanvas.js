var renderlib;
if (!renderlib) renderlib = {}; // initialise the top-level module if it does not exist
if (!renderlib.screens) renderlib.screens = {};
    
renderlib.screens.fullCanvas = function(where, game,width,height) {
    var game_width = game.extents.x2 - game.extents.x1 + width;
    var game_height = game.extents.y2 - game.extents.y1 + height;
    
    var prev_gamescreen_width = $(where).width();
    var prev_gamescreen_height = $(where).height();
    var prev_gamescreen_scroll = $(where).css("overflow");
    
    $(where).css("overflow", "scroll");
    $(where).width(width);
    $(where).height(height);
    
    var canvas = $("<canvas width=\"" + game_width + "\" height=\"" + game_height + "\"></canvas></div>").appendTo($(where));
    var console = $('<div class="console"></div>').appendTo($(where));
    console.width(width);
    

    var ctx = canvas[0].getContext("2d"); // don't like the [0] subscript - some jQuery thing I don't understand?
    
    return {
        cleanup: function() {
            canvas.remove();
            $(where).css("overflow", prev_gamescreen_scroll);
            $(where).width(prev_gamescreen_width);
            $(where).height(prev_gamescreen_height);
            console.remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new renderlib.util.Cartesian2Screen(game.extents.x1 - half_viewportwidth,
                game.extents.y1 - half_viewportheight,
                game.extents.x2 + half_viewportwidth,
                game.extents.y2 + half_viewportheight);
            
            $(where).scrollLeft(c2s.cartesian2screenx(x1));
            $(where).scrollTop(c2s.cartesian2screeny(y2));
            
            return {
                draw: function(d) {
                    renderlib.util.Timer.start("FullCanvas");
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(
                        c2s.cartesian2screenx(x1),
                        c2s.cartesian2screeny(y1),
                        c2s.cartesian2screenx(x2) - c2s.cartesian2screenx(x1),
                        c2s.cartesian2screeny(y2) - c2s.cartesian2screeny(y1)
                    );
                                        
                    renderlib.util.Timer.substart("Draw");
                    d(c2s, ctx);
                    renderlib.util.Timer.subend();
                    
                    renderlib.util.Timer.end();
                },
                console: function (html) {
                    $(console).html(html);
                }

            };
        }
    };
};



