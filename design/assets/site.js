// Shared chrome for the mockup pages: header, mobile menu, footer.
(function () {
  const page = document.body.dataset.page || "";
  const nav = [
    ["Classes", "book.html?type=class", "classes"],
    ["Private lessons", "book.html", "book"],
    ["Weddings", "index.html#weddings", "weddings"],
    ["Studio hire", "studio-hire.html", "hire"],
    ["Team", "index.html#team", "team"],
    ["Visit", "index.html#visit", "visit"],
  ];
  const arrow = '<svg class="arrow" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const brand = (cls = "") =>
    `<a class="brand ${cls}" href="index.html"><img src="assets/img/i2d-mark.svg" alt="" width="62" height="30"><span class="brand-name"><b>Inspiration 2 Dance</b><span>Piccadilly, London</span></span></a>`;

  const header = document.querySelector("[data-header]");
  if (header) {
    header.outerHTML = `
<header class="site-header">
  <div class="rail">
    ${brand()}
    <nav class="nav" aria-label="Main">
      ${nav.map(([t, h, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    </nav>
    <div class="header-cta">
      <a class="btn btn-ghost btn-sm" href="tel:+447711652875">07711 652 875</a>
      <a class="btn btn-primary btn-sm" href="book.html">Book</a>
    </div>
    <button class="burger" aria-label="Open menu" aria-expanded="false">
      <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
  </div>
</header>
<div class="mobile-menu" role="dialog" aria-label="Menu">
  <div class="top">${brand()}
    <button class="burger" data-close aria-label="Close menu" style="display:inline-flex">
      <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
  </div>
  <nav aria-label="Mobile">
    ${nav.map(([t, h]) => `<a href="${h}">${t}${arrow}</a>`).join("")}
  </nav>
  <div class="foot">
    <a class="btn btn-primary btn-block" href="book.html">Book a lesson</a>
    <a class="btn btn-ghost btn-block" href="tel:+447711652875">Call 07711 652 875</a>
  </div>
</div>`;
  }

  const footer = document.querySelector("[data-footer]");
  if (footer) {
    footer.outerHTML = `
<footer class="site-footer">
  <div class="rail">
    <div class="grid">
      <div>
        ${brand()}
        <p class="blurb">A 1920s ballroom on Piccadilly. Dancing seven days a week since 2015.</p>
        <div class="social">
          <a href="https://www.instagram.com/" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg></a>
          <a href="https://www.facebook.com/" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z"/></svg></a>
        </div>
      </div>
      <div>
        <h4>Dance</h4>
        <ul>
          <li><a href="book.html?type=taster">Taster lesson</a></li>
          <li><a href="book.html">Private lessons</a></li>
          <li><a href="book.html?type=class">Group classes</a></li>
          <li><a href="index.html#weddings">Wedding dance</a></li>
          <li><a href="#">Gift vouchers</a></li>
        </ul>
      </div>
      <div>
        <h4>Studio</h4>
        <ul>
          <li><a href="studio-hire.html">Studio hire</a></li>
          <li><a href="index.html#team">Our team</a></li>
          <li><a href="#">Dance Legends United</a></li>
          <li><a href="#">IDTA exams</a></li>
          <li><a href="#">Gallery</a></li>
        </ul>
      </div>
      <div>
        <h4>Visit</h4>
        <ul>
          <li>The Dilly, Floor C<br>21 Piccadilly, London W1J 0BH</li>
          <li><a href="tel:+447711652875">07711 652 875</a></li>
          <li>Mon to Fri 10:00 to 21:45<br>Sat and Sun 10:00 to 19:45</li>
        </ul>
      </div>
    </div>
    <div class="legal">
      <span>© ${new Date().getFullYear()} Inspiration 2 Dance</span>
      <span><a href="#">Terms</a> &nbsp;·&nbsp; <a href="#">Privacy</a></span>
    </div>
  </div>
</footer>`;
  }

  const menu = document.querySelector(".mobile-menu");
  document.querySelectorAll(".site-header .burger").forEach((b) =>
    b.addEventListener("click", () => { menu.classList.add("open"); document.body.style.overflow = "hidden"; })
  );
  menu?.querySelector("[data-close]").addEventListener("click", () => { menu.classList.remove("open"); document.body.style.overflow = ""; });
  menu?.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () => { menu.classList.remove("open"); document.body.style.overflow = ""; }));

  const head = document.querySelector(".site-header");
  const onScroll = () => head && head.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Chrome-style tab groups: [data-tabs] buttons with aria-controls
  document.querySelectorAll("[data-tabs]").forEach((bar) => {
    const tabs = [...bar.querySelectorAll('[role="tab"]')];
    tabs.forEach((t) =>
      t.addEventListener("click", () => {
        tabs.forEach((x) => {
          const on = x === t;
          x.setAttribute("aria-selected", on);
          const p = document.getElementById(x.getAttribute("aria-controls"));
          if (p) p.classList.toggle("hidden", !on);
        });
        bar.dispatchEvent(new CustomEvent("tabchange", { detail: t.dataset.value }));
      })
    );
  });
})();
