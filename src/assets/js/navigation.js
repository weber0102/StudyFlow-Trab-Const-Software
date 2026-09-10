(() => {
  const storageKey = "studyflow-sidebar-state";
  const mobileQuery = window.matchMedia("(max-width: 69.999rem)");

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const toggle = document.querySelector("[data-menu-toggle]");
    const icon = toggle?.querySelector("[data-menu-icon]");
    if (!toggle || !icon) return;

    let desktopCollapsed = localStorage.getItem(storageKey) === "collapsed";
    let mobileOpen = false;

    const applyState = () => {
      if (mobileQuery.matches) {
        root.dataset.menuOpen = String(mobileOpen);
        root.dataset.sidebar = "expanded";
        toggle.setAttribute("aria-expanded", String(mobileOpen));
        toggle.setAttribute("aria-label", mobileOpen ? "Fechar menu de navegação" : "Abrir menu de navegação");
        icon.textContent = mobileOpen ? "×" : "☰";
      } else {
        root.dataset.menuOpen = "false";
        root.dataset.sidebar = desktopCollapsed ? "collapsed" : "expanded";
        toggle.setAttribute("aria-expanded", String(!desktopCollapsed));
        toggle.setAttribute("aria-label", desktopCollapsed ? "Expandir menu de navegação" : "Recolher menu de navegação");
        icon.textContent = "☰";
      }
    };

    toggle.addEventListener("click", () => {
      if (mobileQuery.matches) {
        mobileOpen = !mobileOpen;
      } else {
        desktopCollapsed = !desktopCollapsed;
        localStorage.setItem(storageKey, desktopCollapsed ? "collapsed" : "expanded");
      }
      applyState();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileOpen) {
        mobileOpen = false;
        applyState();
        toggle.focus();
      }
    });

    document.querySelectorAll(".site-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileQuery.matches) {
          mobileOpen = false;
          applyState();
        }
      });
    });

    mobileQuery.addEventListener("change", () => {
      mobileOpen = false;
      applyState();
    });

    applyState();
  });
})();
