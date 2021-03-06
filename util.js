var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist

gamescreen.util = (function() {
    var printTimer = function (t,indent) {
        var prefix="";
        for (var i = 0; i < indent; i++) prefix+=" ";

        $("#console").val("");
        // print the subtimers
        var subtimers = t[3];
        _.keys(subtimers).forEach(function (subtimername) {
            var subtimes = subtimers[subtimername][1];
            var subtiming = subtimers[subtimername][0];

            $("#console").val($("#console").val() + "\n" + prefix + "  [S][" + subtimername +"] " + subtiming + " <" + subtimes + ">");
        });
        $("#console").val($("#console").val() + "\n" + "[T][" + t[0] + "] " + (t[1]));
    };
    var Timer = {
        timers : []
    };

    Timer.start = function (label) {
        var timer = [label, Date.now(), [], {}];
        this.timers.push(timer);
        return timer;
    };

    Timer.end = function () {
        var t = this.timers.pop();
        t[1] = (Date.now()-t[1]);
        if (typeof(console) !== 'undefined')
            printTimer(t, this.timers.length*4);
        return t;
    };

    Timer.substart = function(label) {
        var t = _.last(this.timers);
        if (t === undefined) return;
        var subtimers = t[2];
        var subtimerstotals = t[3];
        if (!_.contains(_.keys(subtimerstotals), label)) {
            subtimerstotals[label] = [0,0];
        }
        var subtimer = [label, Date.now()];
        subtimers.push(subtimer);
        return subtimer;
    };

    Timer.subend = function() {
        var t = _.last(this.timers);
        if (t === undefined) return;
        var subtimer = t[2].pop();
        var subtimertotal = t[3][subtimer[0]];
        subtimertotal[0] += (Date.now() - subtimer[1]);
        subtimertotal[1] += 1;
        return subtimertotal;
    };


    return {
        Timer: Timer,
        Cartesian2Screen: function(x1, y1, x2, y2) {
            
            return {
                cartesian2screenx: function(x) {
                    return x - x1;
                },
                cartesian2screeny: function(y) {
                    return y2 + (-1 * y);
                },
                width: function() {
                    return x2 - x1;
                },
                height: function() {
                    return y2 - y1;
                },
                toString: function() {
                    return "[" + x1 + "," + y1 + "] x [" + x2 + "," + y2 + "]";
                }
                
            };
        },

        Screen: function(x1, y1, x2, y2) {
            
            return {
                cartesian2screenx: function(x) {
                    return x - x1;
                },
                cartesian2screeny: function(y) {
                    return y - y1;
                },
                width: function() {
                    return x2 - x1;
                },
                height: function() {
                    return y2 - y1;
                },
                toString: function() {
                    return "[" + x1 + "," + y1 + "] x [" + x2 + "," + y2 + "]";
                },
                x1:x1,
                y1:y1,
                x2:x2,
                y2:y2
                
            };
        },
        Identity: function (x1,y1,x2,y2) {
            return {
                cartesian2screenx: function(x) {
                    return x;
                },
                cartesian2screeny: function(y) {
                    return y;
                },
                width: function() {
                    return x2 - x1;
                },
                height: function() {
                    return y1 - y2;
                },
                toString: function() {
                    return "I[" + x1 + "," + y1 + "] x [" + x2 + "," + y2 + "]";
                }
            };
        },
        grid: function (ctx, colour, c2s, x1, y1, x2, y2, size) {
            ctx.fillStyle = "rgba(30, 30, 30, 1)";
            ctx.font = "normal 12px sans-serif";

            for (var x = x1; x<=x2-size; x+=size) {
                for (var y = y1; y <= y2-size; y+=size) {
                    ctx.strokeStyle = colour;
                    ctx.strokeRect(c2s.cartesian2screenx(x),c2s.cartesian2screeny(y),size,size);
                    ctx.fillText("(" + x + "," + y + ")", c2s.cartesian2screenx(x),c2s.cartesian2screeny(y));
                }
            }
            
        },
        convertMouseToCanvas: function (e) {

            //this section is from http://www.quirksmode.org/js/events_properties.html
            var targ;
            if (!e)
                e = window.event;
            if (e.target)
                targ = e.target;
            else if (e.srcElement)
                targ = e.srcElement;
            if (targ.nodeType == 3) // defeat Safari bug
                targ = targ.parentNode;

            // jQuery normalizes the pageX and pageY
            // pageX,Y are the mouse positions relative to the document
            // offset() returns the position of the element relative to the document
            var x = e.pageX - $(targ).offset().left;
            var y = e.pageY - $(targ).offset().top;

            return {"x": x, "y": y};
        }

    };
    
})();
//    function createBlock(x,y, width, height) {
   //     return $P($V(x-width,y-width), $V(x+width,y-height), $V(x+width,y+height), $V(x-width,y+height))
    //}


/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

