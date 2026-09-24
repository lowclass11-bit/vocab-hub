/* 우리반 앱 도장 연동.
   앱에서 ?stamp=<토큰>&back=<앱 주소> 를 달고 들어왔을 때만 동작합니다.
   게임이 끝나는 곳에서 reportStamp() 를 부르면 됩니다. */
(function () {
  var HOOK = 'https://script.google.com/macros/s/AKfycbyIaPIJyGsYuPa3TyHwclBgZ8SoXLIIeddKXdUzu4oNwzzjlGOxcEw_1PjYsM-0fKhRvg/exec';

  var me = document.currentScript;
  var game = (me && me.getAttribute('data-game')) || '';
  var q = new URLSearchParams(location.search);
  var token = q.get('stamp');
  var back = q.get('back');

  window.reportStamp = function () {};
  if (!token || !game) return;

  var bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:99999;'
    + 'background:rgba(20,22,26,.82);color:#fff;border-radius:999px;'
    + 'padding:8px 14px;font-size:13px;font-family:system-ui,-apple-system,sans-serif;'
    + 'text-decoration:none;display:flex;gap:8px;align-items:center;';
  bar.textContent = '🏅 우리반 도장 모으는 중';
  if (document.body) document.body.appendChild(bar);
  else document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(bar); });

  var sent = false;
  window.reportStamp = function () {
    if (sent) return;
    sent = true;
    try {
      navigator.sendBeacon(HOOK, new Blob(
        ['t=' + encodeURIComponent(token) + '&g=' + encodeURIComponent(game)],
        { type: 'application/x-www-form-urlencoded' }
      ));
    } catch (e) {
      /* 못 보내도 게임은 계속 됩니다 */
    }
    bar.textContent = '🏅 도장 받았어요!';
    if (back) {
      var a = document.createElement('a');
      a.href = back;
      a.textContent = '우리반으로';
      a.style.cssText = 'color:#ffd9e3;text-decoration:underline;';
      bar.appendChild(a);
    }
  };
})();
