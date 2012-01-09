$(function () {
    
    var SCREEN_WIDTH = 1024;
    var SCREEN_HEIGHT = 768;
    var WORLD = 100;

    var viewport = new gamescreen.create($("#gamescreen"),
        gamescreen.screens.scrollingCanvas,
        gamescreen.world(100),
        [0,0],
        SCREEN_WIDTH,
        SCREEN_HEIGHT, "rgb(40,40,40)");

    var view = gamescreen.createView(viewport, SCREEN_WIDTH, SCREEN_HEIGHT, function (screen, drawing, isDrawing, elapsed) {
        screen.draw(function (c2s,ctx) {
            gamescreen.util.grid(ctx, "rgb(0,0,0)", c2s, -WORLD, -WORLD, WORLD, WORLD, 10);
        });
    });

    var tick = function (time) {
        view.draw(time);
        window.requestAnimFrame(tick);
    };

    window.requestAnimFrame(tick);
});