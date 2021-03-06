/*!
 * ==========================================================================
 * "CoPoKo Space" License
 * GNU General Public License version 3.0 (GPLv3)
 * ==========================================================================
 * This file is part of "CoPoKo Space"
 *
 * "CoPoKo Space" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * "CoPoKo Space" is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with "CoPoKo Space". If not, see <http://www.gnu.org/licenses/>.
 * ==========================================================================
*/
(function () {
  var width,
    height,
    largeHeader,
    canvas,
    ctx,
    circles,
    target,
    animateHeader = true;

  // Main
  initHeader();
  addListeners();

  function initHeader() {
    width = window.innerWidth;
    height = window.innerHeight;
    target = { x: 0, y: height };

    largeHeader = document.getElementById("large-header");
    largeHeader.style.height = height + "px";

    canvas = document.getElementById("header-canvas");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");

    // create particles
    circles = [];
    for (var x = 0; x < width * 0.5; x++) {
      var c = new Circle();
      circles.push(c);
    }
    animate();
  }

  // Event handling
  function addListeners() {
    window.addEventListener("scroll", scrollCheck);
    window.addEventListener("resize", resize);
  }

  function scrollCheck() {
    if (document.body.scrollTop > height) animateHeader = false;
    else animateHeader = true;
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    largeHeader.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
  }

  function animate() {
    if (animateHeader) {
      ctx.clearRect(0, 0, width, height);
      for (var i in circles) {
        circles[i].draw();
      }
    }
    requestAnimationFrame(animate);
  }

  // Canvas manipulation
  function Circle() {
    var _this = this;

    // constructor
    (function () {
      _this.pos = {};
      init();
      // console.log(_this);
    })();

    function init() {
      _this.pos.x = Math.random() * width;
      _this.pos.y = height + Math.random() * 100;
      _this.alpha = 0.1 + Math.random() * 0.3;
      _this.scale = 0.1 + Math.random() * 0.3;
      _this.velocity = Math.random();
    }

    this.draw = function () {
      if (_this.alpha <= 0) {
        init();
      }
      _this.pos.y -= _this.velocity;
      _this.alpha -= 0.0005;
      ctx.beginPath();
      ctx.arc(
        _this.pos.x,
        _this.pos.y,
        _this.scale * 10,
        0,
        2 * Math.PI,
        false
      );
      ctx.fillStyle = "rgba(255,255,255," + _this.alpha + ")";
      ctx.fill();
    };
  }
})();
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik M??ller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function () {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
})();

// MIT license MHuiG
let Parallax = {};
Parallax.options = {};
Parallax.options.speed = 0.25;
Parallax.options.zIndex = -100;
Parallax.options.fade = 1500;
Parallax.slidein = () => {
  let slider = Parallax.mirrors[0].slider;
  if (Parallax.mirrors.length >= 2) {
    slider = Parallax.mirrors[1].slider;
  }
  var opac = parseFloat(slider.style.opacity);
  if (opac !== 1) {
    if (Parallax.mirrors.length >= 2) {
      opac = opac + 0.1;
      slider.style.opacity = opac;
      setTimeout(Parallax.slidein, Parallax.options.fade / 10);
    } else {
      slider.style.opacity = 1;
    }
  } else {
    if (Parallax.mirrors.length >= 2) {
      Parallax.mirrors[0].mirror.remove();
      Parallax.mirrors.shift();
    }
  }
};
Parallax.start = () => {
  let mirror = document.createElement("div");
  mirror.classList.add("parallax-mirror");
  mirror.style.visibility = "hidden";
  mirror.style.zIndex = Parallax.options.zIndex;
  mirror.style.position = "fixed";
  mirror.style.top = 0;
  mirror.style.left = 0;
  mirror.style.overflow = "hidden";
  Parallax.window.appendChild(mirror);
  let slider = document.createElement("img");
  slider.src = Parallax.options.src;
  slider.alt = "parallax";
  slider.classList.add("parallax-slider");
  slider.style.opacity = 0;
  mirror.appendChild(slider);
  if (!Parallax.mirrors) {
    Parallax.mirrors = [];
  }
  let mirrorItem = {};
  mirrorItem.mirror = mirror;
  mirrorItem.slider = slider;
  Parallax.mirrors.push(mirrorItem);
  Parallax.slidein();
  slider.addEventListener(
    "load",
    function () {
      Parallax.update();
    },
    false
  );
};
Parallax.init = () => {
  function loadDimensions() {
    Parallax.wH = document.documentElement.clientHeight;
    Parallax.wW = document.documentElement.clientWidth;
  }
  function getScrollTop() {
    var scrollPos;
    if (window.pageYOffset) {
      scrollPos = window.pageYOffset;
    } else if (document.compatMode && document.compatMode != "BackCompat") {
      scrollPos = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollPos = document.body.scrollTop;
    }
    return scrollPos;
  }
  function loadScrollPosition() {
    const winScrollTop = getScrollTop();
    Parallax.sT = Math.max(0, winScrollTop);
    Parallax.sL = Math.max(0, document.body.scrollLeft);
    Parallax.overScroll = Math.min(winScrollTop, 0);
  }
  window.addEventListener(
    "resize",
    function () {
      loadDimensions();
      Parallax.update();
    },
    false
  );
  loadDimensions();
  let lastPosition = -1;
  (function loop() {
    const yoffset = getScrollTop();
    if (lastPosition !== yoffset) {
      lastPosition = yoffset;
      loadScrollPosition();
      Parallax.update();
    }
    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame;
    window.requestAnimationFrame(loop);
  })();
};

Parallax.refreshItem = (slider) => {
  Parallax.options.aspectRatio =
    slider.naturalWidth / (slider.naturalHeight || 1);
  const aspect = Parallax.options.aspectRatio || 1;
  Parallax.options.boxWidth = Parallax.window.clientWidth;
  Parallax.options.boxHeight = Parallax.window.clientHeight;
  Parallax.options.boxOffsetTop = Parallax.window.scrollTop;
  Parallax.options.boxOffsetLeft = Parallax.window.scrollLeft;
  Parallax.options.boxOffsetBottom =
    Parallax.options.boxOffsetTop + Parallax.options.boxHeight;
  const winHeight = Parallax.wH;
  const maxOffset = Parallax.options.boxOffsetTop;
  const minOffset = Math.max(
    Parallax.options.boxOffsetTop + Parallax.options.boxHeight - winHeight,
    0
  );
  const imageHeightMin =
    (Parallax.options.boxHeight +
      (maxOffset - minOffset) * (1 - Parallax.options.speed)) |
    0;
  const imageOffsetMin =
    ((Parallax.options.boxOffsetTop - maxOffset) *
      (1 - Parallax.options.speed)) |
    0;
  let margin;
  if (Parallax.options.boxWidth < imageHeightMin * aspect) {
    Parallax.options.imageWidth = (imageHeightMin * aspect) | 0;
    Parallax.options.imageHeight = imageHeightMin;
    Parallax.options.offsetBaseTop = imageOffsetMin;
    margin = Parallax.options.imageWidth - Parallax.options.boxWidth;
    Parallax.options.offsetLeft = (-margin / 2) | 0;
  } else {
    Parallax.options.imageWidth = Parallax.options.boxWidth;
    Parallax.options.imageHeight = (Parallax.options.boxWidth / aspect) | 0;
    Parallax.options.offsetLeft = 0;
    margin = Parallax.options.imageHeight - imageHeightMin;
    Parallax.options.offsetBaseTop = (imageOffsetMin - margin / 2) | 0;
  }
};
Parallax.renderItem = (mirror, slider) => {
  const scrollTop = Parallax.sT;
  const scrollLeft = Parallax.sL;
  const scrollBottom = scrollTop + Parallax.wH;
  if (
    Parallax.options.boxOffsetBottom > scrollTop &&
    Parallax.options.boxOffsetTop <= scrollBottom
  ) {
    Parallax.options.visibility = "visible";
    Parallax.options.mirrorTop = Parallax.options.boxOffsetTop - scrollTop;
    Parallax.options.mirrorLeft = Parallax.options.boxOffsetLeft - scrollLeft;
    Parallax.options.offsetTop =
      Parallax.options.offsetBaseTop -
      Parallax.options.mirrorTop * (1 - Parallax.options.speed);
  } else {
    Parallax.options.visibility = "hidden";
  }
  mirror.style.transform =
    "translate3d(" +
    Parallax.options.mirrorLeft +
    "px, " +
    Parallax.options.mirrorTop +
    "px, 0px)";
  mirror.style.visibility = Parallax.options.visibility;
  mirror.style.height = Parallax.options.boxHeight + "px";
  mirror.style.width = Parallax.options.boxWidth + "px";

  slider.style.transform =
    "translate3d(" +
    Parallax.options.offsetLeft +
    "px, " +
    Parallax.options.offsetTop +
    "px, 0px)";
  slider.style.position = "absolute";
  slider.style.height = Parallax.options.imageHeight + "px";
  slider.style.width = Parallax.options.imageWidth + "px";
  slider.style.maxWidth = "none";
};
Parallax.update = () => {
  if (!Parallax.mirrors) {
    return
  }
  Parallax.mirrors.forEach((e) => {
    Parallax.refreshItem(e.slider);
    Parallax.renderItem(e.mirror, e.slider);
  });
};


/*sart*/
let ParallaxWindow = document.querySelector("#parallax-window");
Parallax.window = ParallaxWindow;

var imgs = [
  "https://fastly.jsdelivr.net/gh/MHG-LAB/cron@gh-pages/bing/bing.jpg",
  "https://fastly.jsdelivr.net/gh/MHG-LAB/cron@gh-pages/bing/1.jpg",
  "https://fastly.jsdelivr.net/gh/MHG-LAB/cron@gh-pages/bing/2.jpg",
  "https://fastly.jsdelivr.net/gh/MHG-LAB/cron@gh-pages/bing/3.jpg",
  "https://fastly.jsdelivr.net/gh/MHG-LAB/cron@gh-pages/bing/4.jpg",
  "https://fastly.jsdelivr.net/gh/MHG-LAB/cron@gh-pages/bing/5.jpg",
  "https://fastly.jsdelivr.net/gh/MHG-LAB/cron@gh-pages/bing/6.jpg",
  "https://fastly.jsdelivr.net/gh/MHG-LAB/cron@gh-pages/bing/7.jpg",
];
var index = 0;
function shuffle(arr) {
  var n = arr.length;
  while (n--) {
    var index = Math.floor(Math.random() * n);
    var temp = arr[index];
    arr[index] = arr[n];
    arr[n] = temp;
  }
}
// shuffle(imgs);
function next_parallax() {
  Parallax.options.src = imgs[index % imgs.length];
  Parallax.start();
  index++;
  fetch(imgs[index % imgs.length] + "?t=" + new Date().getTime());
}
next_parallax();
Parallax.init();
let IntervalParallax = setInterval(function () {
  next_parallax();
}, 15000);