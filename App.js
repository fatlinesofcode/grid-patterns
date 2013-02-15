$(document).ready(function () {
    var _backgroundGradient, _backgroundGrid;
    var FPS = 60;
    $.ajaxSetup({
        cache: true
    });

    // load external resources
    var url1 = "http://code.createjs.com/easeljs-0.4.1.min.js";
    var url2 = "http://code.createjs.com/tweenjs-0.2.0.min.js";
    $.getScript(url1, function () {
        $.getScript(url2, function () {
            init();
        })
    })


    var init = function() {
        initAppClasses();
        _backgroundGradient = new BackgroundGradient($("#gradientCanvas").get(0))
        _backgroundGrid = new BackgroundGrid($("#gridCanvas").get(0))

        Ticker.addListener(onTick);
        Ticker.setFPS(FPS);

      //
        setTimeout(function(){
            _backgroundGradient.resetEffect()
            _backgroundGrid.intro();
        },500);

    }

    var onTick = function () {
        if (_backgroundGrid) {
            _backgroundGrid.tick(true);
        }

    }


});

var initAppClasses = function() {


    /**
     * Created by IntelliJ IDEA.
     * User: phil
     * Date: 17/06/11
     * Time: 11:06 AM
     * To change this template use File | Settings | File Templates.
     */
    (function(window) {
        // classes definition and extension
        BackgroundGradient = function(canvas) {

            this.initialize(canvas);
        }
        var p = BackgroundGradient.prototype;

        // static member
        BackgroundGradient.className = "BackgroundGradient"
        // private member
        var _name = "BackgroundGradient"
        /*
         * public getter
         *
         */
        p.getName = function() {
            return _name;
        }
        /*
         * public setter
         */
        p.setName = function(str) {
            _name = str;
        }
        p.toString = function() {
            return "[BackgroundGradient (name=" + _name + ":" + ")]";
        }


        var _canvas;
        var _canvasContent;
        var _stage;
        var _bg;
        var _bg2;

        var _alpha1 = 0
        var _alpha2 = 1
        var _amt = .01
        var _colorIndex1 = 0;
        var _colorIndex2 = 1;


        var _colors = [
            [255, 178, 209],
            [178, 227,255]
        ]
        var _effectInterval;
        var _scrolling =false;
        p.initialize = function(canvas) {
            _canvas = canvas
            _canvasContent = _canvas.getContext("2d");
            _stage = new Stage(_canvas);

            //canvas.width = Main.stageWidth()
            // canvas.height = Main.stageHeight()

            _bg = new Shape();
            _stage.addChild(_bg)
            _bg2 = new Shape();
            _stage.addChild(_bg2)
            //drawGradient(_alpha1, _alpha2);
            p.redraw();

            // EventCore.bind(EventCore.PROJECT_SCROLL_START, onProjectScrolling)
            // EventCore.bind(EventCore.PROJECT_SCROLL_COMPLETE, onProjectScrollingComplete)
            // resetEffect();

        }
        var onProjectScrolling = function() {
            _scrolling=true;
        }
        var onProjectScrollingComplete = function() {
            _scrolling=false;
        }
        p.startEffect = function() {
            _effectInterval = setInterval(adjustAlphas, 70)
        }
        p.stopEffect = function() {
            clearInterval(_effectInterval)
        }
        p.resetEffect = function() {
            p.stopEffect();
            setTimeout(p.startEffect, 20000)
        }
        var adjustAlphas = function() {
            if(_scrolling)return;
            if (_alpha1 < 1 && _amt > 0) {
                _alpha1 = MathUtil.round(_alpha1 + _amt, 2)
                _alpha2 = MathUtil.round(_alpha2 - _amt, 2)
                drawGradient(_alpha1, _alpha2);
            } else if (_alpha2 < 1 && _amt < 0) {
                _alpha1 = MathUtil.round(_alpha1 + _amt, 2)
                _alpha2 = MathUtil.round(_alpha2 - _amt, 2)
                drawGradient(_alpha1, _alpha2);
            } else {
                _amt *= -1
                p.resetEffect()
                return;


            }

        }
        var getColor = function(index, alpha) {
            return "rgba(" + _colors[index][0] + "," + _colors[index][1] + "," + _colors[index][2] + "," + alpha + ")"
        }


        var drawGradient = function (a, a2) {

            var width = _canvas.width // stageWidth
            var height = _canvas.height // stageHeight
            if (isNaN(a) || isNaN(a2))
                return;


            try {
                _bg.graphics.clear();
                var lc = getColor(_colorIndex1, a)//"rgba(166,211,183," + a + ")"
                var lca = getColor(_colorIndex1, a2)//"rgba(166,211,183," + a2 + ")"
                var rc = getColor(_colorIndex2, a)//"rgba(208,166,211," + a + ")"
                var rca = getColor(_colorIndex2, a2)//"rgba(208,166,211," + a2 + ")"

                _bg.graphics.beginLinearGradientFill([lc,lca], [0.0, 1], 0, 0, width, height).drawRect(0, 0, width, height);
                _bg.graphics.beginLinearGradientFill([rca,rc], [0.0, 1], 0, 0, width, height).drawRect(0, 0, width, height);

            } catch(e) {
                log(e);
            }

            _stage.update()
        }
        p.redraw = function() {
            _canvas.width = $(document).width()
            _canvas.height = $(document).height()
            drawGradient(_alpha1, _alpha2);
        }


    }(window));



    /**
     * Created by IntelliJ IDEA.
     * User: phil
     * Date: 17/06/11
     * Time: 11:58 AM
     * To change this template use File | Settings | File Templates.
     */
    (function(window) {
        // classes definition and extension
        BackgroundGrid = function(canvas) {
            this.initialize(canvas);
        }
        var p = BackgroundGrid.prototype

        // static member
        BackgroundGrid.className = "BackgroundGrid"
        // private member
        var _name = "BackgroundGrid"
        var _intro = true;
        /*
         * public getter
         *
         */
        p.getName = function() {
            return _name;
        }
        /*
         * public setter
         */
        p.setName = function(str) {
            _name = str;
        }
        p.toString = function() {
            return "[BackgroundGrid (name=" + _name + ")]";
        }
        window.BackgroundGrid = BackgroundGrid;

        var _canvas;
        var _canvasContent;
        var _stage;
        var _bg;
        var _mx;
        var _my;
        var _mark;
        var _tiles = [];
        var RANDOM_INTEVAL = 30 * 1000


        p.initialize = function(canvas) {
            _canvas = canvas
            _canvasContent = _canvas.getContext("2d");
            _stage = new Stage(_canvas);
            _bg = new Container();
            _stage.addChild(_bg)


            $(document).bind('touchmove', function(e){e.preventDefault()})

            $(document).bind('mousedown', function(event) {
                _mx = event.pageX;
                _my = event.pageY;
            });
            $(document).bind('mouseup', function(event) {
                if (_mark != null) {
                    setTimeout(function(){
                        p.hitTile(_mark)
                    },50);
                }
            });

            p.redraw();
            _intro = false;
        }
        var stageWidth = function () {
            return $(document).width()
        }
        var stageHeight = function () {
            return $(document).height()
        }
        var drawTiles = function () {
            _bg.removeAllChildren();
            var bw = Tile.WIDTH;

            var cols = Math.ceil((stageWidth()+30) / bw)
            var rows = Math.ceil(stageHeight() / bw)
            var a = 0
            var r = 0;

            //  log("length", cols,  [.1, .2, .3,.4,.5,.6,.7,.8,.9,0.8,.7,.6,.5,.4,.3,.2,.1].length)
            var l = []
            for (var i = 0; i <= cols; i++) {
                //  log((i / cols))
                l[i] = (i / cols)
            }
            for (var i = l.length - 2; i >= 0; i--) {
                l.push([l[i]])
            }
            l = l.reverse()
            var t = ""
            for (var i = 0; i <= Math.ceil((cols - rows) / 2); i++) {
                l.push(l.shift())
            }
            //  alert(t)

            for (var i = 0; i < rows; i++) {
                var ty = (bw) * i
                var as = l.slice(0)
                var len = as.length - 1;
                a = r
                r += 1
                if (r > len) {
                    r = 0
                    //a=0
                    //as.reverse()
                }
                for (var ii = 0; ii < cols; ii++) {
                    //    var t = new Tile()
                    var s = new Tile();
                    s.row = i
                    s.col = ii
                    if (a >= len) {
                        a = 1
                        as.reverse()

                    }
                    else
                        a += 1

                    s.setAlpha(as[a] * 0.4)
                    if(_intro)
                        s.alpha = 1
                    // s.neighbours = []

                    s.x = (bw - 0) * ii
                    s.y = ty
                    _tiles.push(s)


                    //log("len", s, s.neighbours.length)
                    _bg.addChild(s);

                }

            }
            for (var j = 0; j < _tiles.length; j++) {
                var t = _tiles[j]
                t.neighbours = new Array()

                if (_tiles[j - cols])
                    _tiles[j].addNeighbour(_tiles[j - cols]) // top
                if (_tiles[j + 1])
                    _tiles[j].addNeighbour(_tiles[j + 1]) // right
                if (_tiles[j + cols])
                    _tiles[j].addNeighbour(_tiles[j + cols]) // bottom
                if (_tiles[j - 1])
                    _tiles[j].addNeighbour(_tiles[j - 1]) // left

                //log(cols)
                //log(j, t, tiles[j + cols], t.neighbours.length)
            }
            _tiles[_tiles.length-1].last = true;

            //p.hitRandomTile();
        }
        p.startRandomHit = function () {
            return;
            setInterval(p.hitRandomTile, RANDOM_INTEVAL)
            p.hitRandomTile();
        }
        p.intro = function(){
            var n = Math.floor(($(document).width()/90)/2)
            var c = _tiles[n];
            c.displayIntro();
        }

        p.hitRandomTile = function() {
            p.hitTile(_tiles[Math.round(Math.random() * (_tiles.length - 1))])//.hit(0.6)
        }

        p.hitTile = function (mark) {
            for (var j = 0; j < _tiles.length; j++) {
                var t = _tiles[j]
                t.tweening = false;
            }
            mark.hit(0.6);
        }

        var hitTest = function () {
            if (!_mx || !_my)
                return;

            if (! _tiles)
                return
            if (_tiles.length < 0)
                return;

            // log(mx, my);
            var o = true;
            for (var i = 0; i < _tiles.length; i++) {
                if (_tiles[i].contain(_mx, _my, o)) {
                    if (_mark != _tiles[i]) {
                        _mark = _tiles[i];
                    }
                }
                o = false;

            }
        }

        p.tick = function(render) {
            hitTest();
            if(render)
                _stage.update()
            // log("229","BackgroundGrid","tick", "");
        }
        p.redraw = function(){
            //   return;
            _canvas.width = $(document).width()
            _canvas.height = $(document).height()
            drawTiles();
            _stage.update()
        }


    }(window));


    (function(window) {


        Tile = function(graphics) {
            this.initialize(graphics);
        }
        var p = Tile.prototype = new Shape();
        // var p = Shape.prototype = new createjs.DisplayObject();
        Tile.WIDTH = 90

        p._alpha = 1;
        p.W = Tile.WIDTH;
        p.H = Tile.WIDTH;
        p.row = 0
        p.col = 0
        p.last = false;
        p.neighbours = new Array();
        p.tweening = false;

        p.Shape_initialize = p.initialize;

        p.initialize = function(graphics) {
            this.Shape_initialize();
            this.graphics.beginFill(Tile.getColor(1)).drawRect(0, 0, this.W, this.H);
        }

        p.contain = function(_x, _y, o) {

            if (this.x <= _x && _x <= this.x + this.W && this.y <= _y && _y <= this.y + this.H) {
                return true;
            } else {
                return false;
            }
        }

        p.toString = function() {
            return "[TILE (name=" + this.name + " " + this.row + ":" + this.col + ")]";
        }
        p.addNeighbour = function(t) {
            this.neighbours.push(t)
        }
        Tile.getColor = function(alpha) {
            //  return "rgba(0,0,0," + 1 + ")"
            //  return "rgba(255,255,255," + alpha + ")"
            //  return "rgba(153,153,153," + alpha + ")"
            return "rgba(51,51,51," + alpha + ")"
        }
        p.displayIntro = function() {
            if (this.tweening)return;
            this.tweening = true;
            // EventCore.trigger(EventCore.TILE_ANIMATION_START)
            if (this.last) {
                Tween.get(this, false)
                        .to({alpha:this._alpha}, 600).call(function() {
                            //   EventCore.trigger(EventCore.TILE_ANIMATION_COMPLETE)
                        });
            } else {
                Tween.get(this, false)
                        .to({alpha:this._alpha}, 600)
            }

            var _this = this
            setTimeout(function() {
                for (var i = 0; i < 4; i++) {
                    if (_this.neighbours[i]) {
                        //log("neigh", i, _this.neighbours[i])
                        _this.neighbours[i].displayIntro();
                    }
                }
                //  EventCore.trigger(EventCore.TILE_ANIMATION_START)
            }, 50);
        }

        p.setAlpha = function(a) {
            this.alpha = a
            this._alpha = a
        }
        p.hit = function(a) {
            if (this.tweening)return;
            if (a < .01)return;
            this.tweening = true;
            this.alpha = a

            Tween.get(this, false)
                    .wait(300)// +(Math.random()*1000))
                    .to({alpha:this._alpha}, 1000)


            var _this = this
            setTimeout(function() {
                for (var i = 0; i < 4; i++) {
                    if (_this.neighbours[i]) {
                        // log("neigh", this.neighbours[i])
                        _this.neighbours[i].hit(a * 0.9)
                    }
                }
                //    EventCore.trigger(EventCore.TILE_ANIMATION_START)
            }, 50);
        }

        window.Tile = Tile;
    }(window));

    /**
     * Created by IntelliJ IDEA.
     * User: phil
     * Date: 21/06/11
     * Time: 3:54 PM
     *
     */
    (function(window) {
        //--------- class definition and extension ---------//
        this.MathUtil = function() {


        }
        MathUtil.rand = function(minVal, maxVal) {
            return minVal + Math.floor(Math.random() * (maxVal + 1 - minVal));
        }
        MathUtil.round = function(float, decimalPlaces)
        {   if(isNaN(decimalPlaces))decimalPlaces=2
            var power = Math.pow(10, decimalPlaces)
            return Math.round((float) * power) / power
        }

    }(window));


    window.log = function f() {
        log.history = log.history || [];
        log.history.push(arguments);
        if (this.console) {
            var args = arguments, newarr;
            args.callee = args.callee.caller;
            newarr = [].slice.call(args);

            if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);
        }
    };
    (function (a) {
        function b() {}

        for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop());) {a[d] = a[d] || b;}
    })

            (function () {
                try {
                    console.log();
                    return window.console;
                } catch (a) {return (window.console = {});}
            }());

}