// The sidebar is static HTML on each page; this script only adds behavior that
// needs JS anyway: the theme toggle, the portrait fallback, and print handling.
(function () {
  var root = document.documentElement;

  // Theme: light by default (or the OS preference, applied in the inline head
  // script), choice remembered per browser.
  // The toggle sits on <body>, not in the sidebar, so it can be pinned to the
  // viewport corner. It is inserted right after the skip link so its tab-order
  // position matches its visual position at the top of the page.
  var btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.type = 'button';
  btn.innerHTML =
    '<svg class="icon icon-moon" viewBox="0 0 24 24" width="18" height="18" fill="none"' +
      ' stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true" focusable="false">' +
      '<path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z"/>' +
    '</svg>' +
    '<svg class="icon icon-sun" viewBox="0 0 24 24" width="18" height="18" fill="none"' +
      ' stroke="currentColor" stroke-width="1.6" stroke-linecap="round"' +
      ' aria-hidden="true" focusable="false">' +
      '<circle cx="12" cy="12" r="4.2"/>' +
      '<path d="M12 2.7v2.1M12 19.2v2.1M2.7 12h2.1M19.2 12h2.1' +
        'M5.4 5.4 6.9 6.9M17.1 17.1l1.5 1.5M18.6 5.4 17.1 6.9M6.9 17.1 5.4 18.6"/>' +
    '</svg>';

  var skip = document.querySelector('.skip-link');
  if (skip) {
    document.body.insertBefore(btn, skip.nextSibling);
  } else {
    document.body.insertBefore(btn, document.body.firstChild);
  }

  var sync = function () {
    var dark = root.dataset.theme === 'dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  sync();
  btn.addEventListener('click', function () {
    root.classList.add('theme-switching');
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    sync();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.remove('theme-switching'); });
    });
  });

  // Drop the portrait instead of showing a broken image when no photo is present.
  var img = document.querySelector('.sidebar .portrait');
  if (img) {
    var hide = function () { img.remove(); };
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
  }

  // Closed <details> don't print their contents; open them for printing and
  // restore the previous state afterwards. The .printing class must be set
  // before opening: the print snapshot keeps the screen-media animation state,
  // so the open-animation has to be suppressed at open time, not in print CSS.
  var openedForPrint = [];
  window.addEventListener('beforeprint', function () {
    root.classList.add('printing');
    openedForPrint = [];
    document.querySelectorAll('details:not([open])').forEach(function (d) {
      d.open = true;
      openedForPrint.push(d);
    });
  });
  window.addEventListener('afterprint', function () {
    openedForPrint.forEach(function (d) { d.open = false; });
    openedForPrint = [];
    root.classList.remove('printing');
  });
})();
