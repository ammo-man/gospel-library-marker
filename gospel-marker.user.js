// ==UserScript==
// @name         Gospel Library quick marker toolbar
// @namespace    https://github.com/ammo-man/gospel-library-marker
// @version      1.0.1
// @description  Always-visible color/style toolbar for marking text on churchofjesuschrist.org
// @author       ammo-man
// @license      MIT
// @homepageURL  https://github.com/ammo-man/gospel-library-marker
// @updateURL    https://raw.githubusercontent.com/ammo-man/gospel-library-marker/main/gospel-marker.user.js
// @downloadURL  https://raw.githubusercontent.com/ammo-man/gospel-library-marker/main/gospel-marker.user.js
// @match        https://www.churchofjesuschrist.org/study/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==
(() => {
  'use strict';
  if (window.__quickMarker) return;
  window.__quickMarker = true;

  // ---- Everything site-specific lives here (adjust when the site changes) ----
  const SEL = {
    mark:   '[data-testid="fat-mark-button"]',      // title "Mark" (new) or "Style" (existing mark)
    del:    '[data-testid="fat-delete-button-test"]',
    back:   '[data-testid="highlight-back-button"]',
    color:  c => `[data-testid="${c}-highlight"]`,
    style:  s => `[data-testid="${s}-highlight"]`,  // full-height | underline
  };
  // Toolbar order + meaning. id = the site's color name; blue is the site's "light blue".
  const COLORS = [
    { id: 'red',       css: '#c9545f', icon: 'key-fill', label: 'Key verse' },
    { id: 'blue',      css: '#5aaab3', icon: 'brightness-high-fill', label: 'God / Jesus / Holy Ghost' },
    { id: 'pink',      css: '#c05fb0', icon: 'patch-check-fill', label: 'Promise' },
    { id: 'green',     css: '#8aa656', icon: 'book-fill', label: 'Teaching' },
    { id: 'brown',     css: '#9a6a58', icon: 'hourglass-split', label: 'History' },
    { id: 'purple',    css: '#7a58a8', icon: 'lightning-charge-fill', label: 'Priesthood power' },
    { id: 'orange',    css: '#d98e4a', icon: 'exclamation-lg', label: 'Commandment' },
    { id: 'dark_blue', css: '#4a78b0', icon: 'globe-americas', label: 'Missionary work' },
    { id: 'yellow',    css: '#e0c04a', icon: 'exclamation-triangle-fill', label: 'Condemnation / sin' },
    { id: 'gray',      css: '#8c9399', icon: 'fire', label: 'The devil' },
  ];
  // Icons: Bootstrap Icons (MIT, https://icons.getbootstrap.com), 16x16 viewBox, white fill
  const ICONS = {
    'key-fill': '<path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>',
    'brightness-high-fill': '<path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>',
    'patch-check-fill': '<path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/>',
    'book-fill': '<path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>',
    'hourglass-split': '<path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>',
    'lightning-charge-fill': '<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>',
    'exclamation-lg': '<path d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0zM7 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0"/>',
    'globe-americas': '<path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z"/>',
    'exclamation-triangle-fill': '<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>',
    'fire': '<path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>',
    'chevron-up': '<path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>',
    'chevron-down': '<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>',
    'trash3': '<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>',
  };
  const svg = n => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">${ICONS[n]}</svg>`;
  // -----------------------------------------------------------------------

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const $ = s => document.querySelector(s);
  async function waitFor(fn, ms = 1500) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) { const v = fn(); if (v) return v; await sleep(40); }
    return null;
  }
  // The site ignores bare .click(); send the full pointer sequence.
  function tap(el) {
    const o = { bubbles: true, cancelable: true, view: window, button: 0, pointerType: 'mouse' };
    for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'])
      el.dispatchEvent(new (t.startsWith('pointer') ? PointerEvent : MouseEvent)(t, o));
  }
  function warn(msg) {
    status.textContent = msg; status.style.display = 'block';
    clearTimeout(warn.t); warn.t = setTimeout(() => status.style.display = 'none', 3500);
  }

  let busy = false;
  async function apply(color, style) {
    if (busy) return; busy = true;
    try {
      let m = $(SEL.mark);
      if (!m || m.disabled) return warn('Select text (or a mark) first');
      if (m.title === 'Mark') {                       // new selection: create with last-used style
        tap(m);
        m = await waitFor(() => { const b = $(SEL.mark); return b && b.title === 'Style' && b; });
        if (!m) return warn('Could not create mark (site changed?)');
      }
      tap(m);                                          // open style menu
      const c = await waitFor(() => $(SEL.color(color)));
      if (!c) return warn('Color menu not found (site changed?)');
      tap(c);
      const s = await waitFor(() => $(SEL.style(style)));
      if (s) { await sleep(120); tap(s); } else warn('Style button not found');
      await sleep(150);
      const b = $(SEL.back); if (b) tap(b);
    } finally { busy = false; }
  }

  // Accept the site's "Are you sure you want to remove...?" dialog the moment it is inserted, and
  // hide it first. MutationObserver callbacks run before the browser paints, so it never shows.
  // Only active during our own delete, so the site's native toolbar still asks as usual.
  function autoConfirm(ms = 2500) {
    return new Promise(resolve => {
      let t;
      const obs = new MutationObserver(muts => {
        for (const m of muts) for (const n of m.addedNodes) {
          if (n.nodeType !== 1 || bar.contains(n)) continue;
          const ok = (n.matches('button') ? [n] : [...n.querySelectorAll('button')])
            .find(b => b.textContent.trim() === 'Delete');
          if (!ok) continue;
          // hide the whole inserted dialog (incl. backdrop); fall back to the button's small ancestor
          let box = n.textContent.length < 600 ? n : ok;
          if (box === ok) while (box.parentElement && box.parentElement !== document.body &&
            box.parentElement.textContent.length < 400) box = box.parentElement;
          box.style.setProperty('display', 'none', 'important');
          tap(ok); obs.disconnect(); clearTimeout(t); return resolve(true);
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
      t = setTimeout(() => { obs.disconnect(); resolve(false); }, ms);
    });
  }

  async function remove() {
    if (busy) return; busy = true;
    try {
      const d = $(SEL.del);
      if (!d || d.disabled) return warn('Nothing to delete');
      const confirmed = autoConfirm();     // start watching BEFORE the dialog can appear
      tap(d);
      if (!(await confirmed)) warn('Confirm button not found (site changed?)');
      await sleep(200);
    } finally { busy = false; }
  }

  // ---- UI ----
  const bar = document.createElement('div');           // outer wrapper: header + body
  Object.assign(bar.style, {
    position: 'fixed', left: '4px', top: '70px', zIndex: 2147483000,   // top-anchored: header stays put on collapse
    width: '92px', background: 'rgba(40,40,40,.92)', borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,.5)', touchAction: 'manipulation',
    userSelect: 'none', webkitUserSelect: 'none', color: '#fff', font: '12px sans-serif',
  });
  const keepSelection = e => e.preventDefault();       // taps must not clear the text selection
  ['mousedown', 'pointerdown', 'touchstart'].forEach(t => bar.addEventListener(t, keepSelection, { passive: false }));

  // header with collapse toggle (state is remembered)
  const header = document.createElement('div');
  Object.assign(header.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '34px', padding: '0 6px 0 10px', cursor: 'pointer', color: '#ccc', fontWeight: '600' });
  const title = document.createElement('span'); title.textContent = 'Marks';
  const chevron = document.createElement('span');
  Object.assign(chevron.style, { font: '16px sans-serif', display: 'flex' });
  header.append(title, chevron);

  const body = document.createElement('div');
  Object.assign(body.style, { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', padding: '2px 6px 6px' });

  let collapsed = localStorage.getItem('quickMarkerCollapsed') === '1';
  const render = () => {
    body.style.display = collapsed ? 'none' : 'grid';
    chevron.innerHTML = svg(collapsed ? 'chevron-down' : 'chevron-up');
  };
  // Header: drag to move the toolbar, tap (no movement) to collapse/expand.
  header.style.cursor = 'grab'; header.style.touchAction = 'none';
  const clamp = () => {                                  // keep the toolbar fully on screen
    const r = bar.getBoundingClientRect();
    bar.style.left = Math.max(0, Math.min(r.left, innerWidth - r.width)) + 'px';
    bar.style.top = Math.max(0, Math.min(r.top, innerHeight - r.height)) + 'px';
  };
  let drag = null;
  header.addEventListener('pointerdown', e => {
    const r = bar.getBoundingClientRect();
    drag = { x: e.clientX, y: e.clientY, left: r.left, top: r.top, moved: false };
    header.setPointerCapture(e.pointerId);
  });
  header.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;   // small wiggles still count as a tap
    drag.moved = true; header.style.cursor = 'grabbing';
    bar.style.left = drag.left + dx + 'px'; bar.style.top = drag.top + dy + 'px'; clamp();
  });
  const endDrag = () => {
    if (!drag) return;
    if (drag.moved) localStorage.setItem('quickMarkerPos', JSON.stringify({ l: bar.style.left, t: bar.style.top }));
    else { collapsed = !collapsed; localStorage.setItem('quickMarkerCollapsed', collapsed ? '1' : '0'); render(); }
    drag = null; header.style.cursor = 'grab'; clamp();
  };
  header.addEventListener('pointerup', endDrag);
  header.addEventListener('pointercancel', () => { drag = null; header.style.cursor = 'grab'; });
  addEventListener('resize', clamp);                     // e.g. iPad rotation

  const btn = (css, label, handler) => {
    const b = document.createElement('div');
    Object.assign(b.style, {
      width: '36px', height: '30px', borderRadius: '7px', cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center', font: '17px sans-serif', color: '#fff',
    });
    Object.assign(b.style, css);
    b.innerHTML = svg(label);
    // Activate on pointerup, not click. preventDefault on touchstart/pointerdown (needed to keep the
    // text selection) makes iOS skip the synthesized click, so a click handler never fires on iPad.
    let down = null, lastFire = 0;
    const fire = () => { lastFire = Date.now(); handler(); };
    b.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
    b.addEventListener('pointerup', e => {
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 12) fire();
      down = null;
    });
    b.addEventListener('pointercancel', () => { down = null; });
    b.addEventListener('click', () => { if (Date.now() - lastFire > 700) fire(); });  // keyboard / fallback
    body.appendChild(b); return b;
  };
  for (const { id, css, icon, label } of COLORS) {
    btn({ background: css }, icon, () => apply(id, 'full-height')).title = label + ' (highlight)';
    // same size as the highlight button; underline is an inset shadow so the icons line up exactly
    btn({ background: '#333', boxShadow: `inset 0 -4px 0 ${css}` }, icon,
        () => apply(id, 'underline')).title = label + ' (underline)';
  }
  const delBtn = btn({ gridColumn: '1 / 3', width: '100%', height: '44px', background: 'transparent',
    font: '26px sans-serif', marginTop: '2px' }, 'trash3', remove);
  delBtn.title = 'Delete mark';
  const status = document.createElement('div');
  Object.assign(status.style, { gridColumn: '1 / 3', display: 'none', font: '11px sans-serif', color: '#ffb' });
  body.appendChild(status);

  bar.append(header, body);
  render();
  document.body.appendChild(bar);
  try {                                                  // restore the last dragged position
    const p = JSON.parse(localStorage.getItem('quickMarkerPos') || 'null');
    if (p) { bar.style.left = p.l; bar.style.top = p.t; }
  } catch (e) {}
  clamp();
})();
