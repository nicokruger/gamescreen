var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist
if (!gamescreen.screens) gamescreen.screens = {};
    
gamescreen.screens.scrollingCanvas = function(where, game, width, height, background, callbacks) {
    
    var c2s;

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

    if (callbacks) {
        var convertMouseToWorld = function (e) {
            var p = gamescreen.util.convertMouseToCanvas(e),
                perc_x = p.x / width,
                perc_y = p.y / height,
                perc_screen_x = (perc_x) * (c2s.x2-c2s.x1) + c2s.x1,
                perc_screen_y = (perc_y) * (c2s.y2-c2s.y1) + c2s.y1;
            return {x:perc_screen_x,y:perc_screen_y};
        };
        if (callbacks.mousemove) {
            $(canvas).mousemove(function (e) {
                callbacks.mousemove(convertMouseToWorld(e));
                e.stopPropogation();
                e.preventDefault();
            });
        }
        if (callbacks.click) {
            $(canvas).click(function (e) {
                callbacks.click(convertMouseToWorld(e));
                e.stopPropogation();
                e.preventDefault();
            });
        }

        if (callbacks.create) {
            callbacks.create($(canvas));
        }
    }
    var ctx = canvas[0].getContext("2d"); // don't like the [0] subscript - some jQuery thing I don't understand?
    
    return {
        cleanup: function() {
            canvas.remove();
            holderdiv.remove();
            consoleDiv.remove();
        },
        
        create: function(x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            c2s = new gamescreen.util.Screen(x1,
                y1,
                x2,
                y2);
            var c2s2 = new gamescreen.util.Identity(game.extents.x1,
                game.extents.y1,
                game.extents.x2,
                game.extents.y2);

            var x_zoom = width/(x2-x1);
            var y_zoom = height/(y2-y1);
            var angle = Math.PI;

            return {
                draw: function(d) {
                    gamescreen.util.Timer.start("FullCanvas");
                    
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.fillStyle = bg;
                    ctx.fillRect(0,0,width,height);
                    
                    gamescreen.util.Timer.substart("Draw");
                    var t = new Transform();
                    //t.scale(x_zoom,y_zoom);

                    var cx = (x1+x2)/2.0,
                        cy = (y1+y2)/2.0,
                        scx = (width)/2.0,
                        scy = (height)/2.0;
                    _console.frame_log(c2s);
                    t.translate(scx - cx, scy - cy);


                    ctx.setTransform(t.m[0], t.m[1], t.m[2], t.m[3], t.m[4], t.m[5]);
                    d(c2s2, ctx);
                    gamescreen.util.Timer.subend();
                    
                    gamescreen.util.Timer.end();
                },
                convertCanvasToScreen: function (p) {
                    return p;
                },
                console: _console
            };
        }
    };
};

