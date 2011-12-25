var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist
if (!gamescreen.screens) gamescreen.screens = {};

gamescreen.screens.gl = function(game,width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvasgl\" width=\"" + width + "\" height=\"" + height + "\" />");
    var canvas = $("#canvasgl")[0];
    
    // attempt to instantiate webgl
    var gl;
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
    
    // Load the shaders
    var glutil = {};
    var shaderloader = gamescreen.screens.gl.shaderloader({vs: "data/shaders/vs.html", fs: "data/shaders/fs.html" }, function(shaders) {
        console.log("SHADERS LOADED");
        glutil.util = gamescreen.renderutil_gl(gl, shaders);
    });

    // Temporary canvas for background image
    var  tmpctx = document.createElement("canvas").getContext("2d");
    tmpctx.canvas.width = width ;
    tmpctx.canvas.height = height;
    var data = tmpctx.createImageData(width, height);
    tmpctx = undefined;
            
    var i = 0;
    return {
        cleanup: function() {
            $("#canvasgl").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var drawers = gamescreen.renderutil.scanPolys(_.map(sectors, function(s) { return s.poly; }), x1,y1,x2-1,y2-1);
            gamescreen.util.Timer.substart("clear");
            for (var i = 0; i < width * height * 4; i++) {
                data.data[i] = 0;
            }
            gamescreen.util.Timer.subend();
            
            return {
                draw: function(textures) {
                    gamescreen.util.Timer.start("gl");
                    if (!shaderloader.ready()) {
                        console.log("shaderloader not ready... not drawing");
                        return;
                    }

                    gamescreen.util.Timer.substart("fill buffer");
                    gamescreen.renderutil.fillBuffer(drawers, textures, data);
                    gamescreen.util.Timer.subend();
                    
                    //glutil.util.loadTexture(textures[i].imageData);
                    gamescreen.util.Timer.substart("fill texture");
                    glutil.util.loadTexture(data);
                    gamescreen.util.Timer.subend();
                    gamescreen.util.Timer.substart("draw scene");
                    glutil.util.drawScene();
                    gamescreen.util.Timer.subend();
                    gamescreen.util.Timer.end();
                }
            };
        }
    };
};

gamescreen.screens.gl.shaderloader = function(shader_map, callback) {
    var unloaded = 0;
    var shaders = {};
    var store = function(shader) {
        return function (data) {
            console.log("shader: " + shader);
            shaders[shader] = {type: $(data).attr("type"), script: $(data).text()};
            unloaded--;
            
            if (unloaded === 0) {
                if (typeof(callback) === "function") {
                    callback(shaders);
                }
            }
        };
    };
    for (var shader in shader_map) {
        console.log("fetching shader: " + shader_map[shader]);
        unloaded++;
        $.get(shader_map[shader], store(shader));
    }
    
    return {
        ready: function() { return unloaded === 0; }
    };
};
