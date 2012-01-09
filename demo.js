$(function () {
    
    var SCREEN_WIDTH = 300;
    var SCREEN_HEIGHT = 300;
    var WORLD = 300;
    var background = "rgb(255,255,255)";
    
    var pos = [400, 0];
    var s = 50;
    var dir = ["left", "down"];
    var grid = function (screen, c2s, ctx) {
        gamescreen.util.grid(ctx, "rgb(0,0,0)", c2s, -WORLD, -WORLD, WORLD, WORLD, 100);
        
        ctx.fillStyle = "rgba(255,0,0,0.5)";
        ctx.beginPath();
        ctx.moveTo(pos[0], pos[1]);
        ctx.lineTo(pos[0]+s, pos[1]);
        ctx.lineTo(pos[0]+s,pos[1]+s);
        ctx.lineTo(pos[0], pos[1]+s);
        ctx.closePath();
        ctx.fill();

        screen.console.frame_log("Test");

    };
    
    var gs1 = new gamescreen.create($("#gamescreen1"),
        [SCREEN_WIDTH, SCREEN_HEIGHT],
        gamescreen.world(WORLD),
        grid, background);
    gs1.resize(WORLD*2, WORLD*2);

    var gs2 = new gamescreen.create($("#gamescreen2"),
        [SCREEN_WIDTH, SCREEN_HEIGHT],
        gamescreen.world(WORLD),
        grid, background);
    var gs3 = new gamescreen.create($("#gamescreen3"),
        [SCREEN_WIDTH, SCREEN_HEIGHT],
        gamescreen.world(WORLD),
        grid, background);
    gs3.resize(100,100);

    var gs4 = new gamescreen.create($("#gamescreen4"),
        [1024, 768],
        gamescreen.world(WORLD),
        grid, background);
    gs4.resize(WORLD*3,WORLD*3);

    var speedx = 1;
    var speedy = 1;
    var tick = function (time) {
        gs1.draw(time);
        gs2.draw(time);
        gs3.center(pos[0]+s/2, pos[1]+s/2);
        gs3.draw(time);
        gs4.draw(time);

        if (dir[0] === "left") {
            pos[0] -= speedx;
        } else if (dir[0] === "right") {
            pos[0] += speedx;
        }
        if (dir[1] == "up") {
            pos[1] += speedy;
        } else if (dir[1] == "down") {
            pos[1] -= speedy;
        }


        if (pos[0] < -WORLD) {
            dir[0] = "right";
            speedx = Math.floor(Math.random() * 10 + 2);
        }
        if (pos[0] > WORLD) {
            dir[0] = "left";
            speedx = Math.floor(Math.random() * 10 + 2);
        }
        if (pos[1] < -WORLD) {
            dir[1] = "up";
            speedy = Math.floor(Math.random() * 10 + 2);
        }
        if (pos[1] > WORLD) {
            dir[1] = "down";
            speedy = Math.floor(Math.random() * 10 + 2);
        }


        window.requestAnimFrame(tick);
    };

    window.requestAnimFrame(tick);
});