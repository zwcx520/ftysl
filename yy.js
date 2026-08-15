(function () {
    var audio = new Audio('yy.mp3');
    audio.loop = true;
    audio.autoplay = true;
    audio.preload = 'auto';

    // 尝试自动播放(部分浏览器允许)
    var p = audio.play();
    if (p && p.catch) {
      // 自动播放被阻止时,监听用户首次交互后自动播放
      var tryPlay = function () {
        audio.play().then(function () {
          removeListeners();
        }).catch(function () {});
      };
      var events = ['click', 'touchstart', 'keydown', 'mousemove'];
      var removeListeners = function () {
        events.forEach(function (evt) {
          document.removeEventListener(evt, tryPlay);
        });
      };
      events.forEach(function (evt) {
        document.addEventListener(evt, tryPlay);
      });
    }
  })();