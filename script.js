// =========================================================
// OM Official Store — shared prototype behaviour
// Guards on element existence so this one file works on
// Homepage, PLP, and PDP without errors.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFooterAccordions();
  initWishlistToggles();
  initDropdowns();
  initFitRadio();
  initGallery();
  initStickyBar();
  initFilterSidebar();
  initLoadMore();
});

/* ---------- Mobile slide-out menu ---------- */
function initMobileMenu() {
  const openBtn = document.querySelector('[data-menu-open]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const closeBtn = document.querySelector('[data-menu-close]');
  if (!openBtn || !overlay) return;

  const open = () => overlay.classList.add('open');
  const close = () => overlay.classList.remove('open');

  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

/* ---------- Footer accordions (mobile) ---------- */
function initFooterAccordions() {
  const accordions = document.querySelectorAll('[data-accordion-trigger]');
  accordions.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const row = trigger.closest('.footer-accordion');
      const isOpen = content.classList.contains('open');
      content.classList.toggle('open', !isOpen);
      row.classList.toggle('open', !isOpen);
    });
  });
}

/* ---------- Wishlist heart toggle ---------- */
function initWishlistToggles() {
  document.querySelectorAll('.wishlist-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
    });
  });
}

/* ---------- Generic dropdown (colourway / size / sort) ---------- */
function initDropdowns() {
  document.querySelectorAll('[data-dropdown]').forEach((dropdown) => {
    const trigger = dropdown.querySelector('[data-dropdown-trigger]');
    const panel = dropdown.querySelector('[data-dropdown-panel]');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.contains('open');
      document.querySelectorAll('[data-dropdown-panel].open').forEach((p) => p.classList.remove('open'));
      panel.classList.toggle('open', !isOpen);
    });

    panel.querySelectorAll('[data-dropdown-option]').forEach((option) => {
      option.addEventListener('click', () => {
        const valueEl = dropdown.querySelector('[data-dropdown-value]');
        if (valueEl) valueEl.textContent = option.textContent.trim();
        panel.classList.remove('open');
      });
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('[data-dropdown-panel].open').forEach((p) => p.classList.remove('open'));
  });
}

/* ---------- Authentic / Replica fit radio ---------- */
function initFitRadio() {
  const group = document.querySelector('[data-fit-radio]');
  if (!group) return;

  const options = group.querySelectorAll('[data-fit-option]');
  const priceEls = document.querySelectorAll('[data-current-price]');

  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      options.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      const price = opt.getAttribute('data-price');
      priceEls.forEach((el) => (el.textContent = price));
    });
  });
}

/* ---------- PDP image gallery: scroll-snap + swipe + dots ----------
   The gallery markup renders a separate desktop track and mobile track
   (toggled with .desktop-only / .mobile-only), both present in the DOM
   at once so each can have layout tailored to its breakpoint rather than
   being proportionally scaled. Every [data-gallery-track] found is wired
   up independently so whichever one is actually visible stays in sync. */
function initGallery() {
  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  const dots = gallery.querySelectorAll('[data-gallery-dot]');
  const prevBtn = gallery.querySelector('[data-gallery-prev]');
  const nextBtn = gallery.querySelector('[data-gallery-next]');

  gallery.querySelectorAll('[data-gallery-track]').forEach((track) => {
    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    function updateActiveDot() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      if (!slideWidth) return;
      const index = Math.round(track.scrollLeft / slideWidth);
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function scrollToIndex(index) {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
    }

    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveDot, 80);
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => scrollToIndex(i));
    });

    prevBtn?.addEventListener('click', () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const currentIndex = Math.round(track.scrollLeft / slideWidth);
      scrollToIndex(Math.max(0, currentIndex - 1));
    });

    nextBtn?.addEventListener('click', () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const currentIndex = Math.round(track.scrollLeft / slideWidth);
      scrollToIndex(Math.min(slides.length - 1, currentIndex + 1));
    });

    window.addEventListener('resize', updateActiveDot);
    updateActiveDot();
  });
}

/* ---------- Sticky bottom purchase bar ---------- */
function initStickyBar() {
  const bar = document.querySelector('[data-sticky-bar]');
  const trigger = document.querySelector('[data-sticky-trigger]');
  if (!bar) return;

  // Always visible once the trigger point (end of main product info) has
  // been scrolled past; hidden while the hero gallery/price block is still
  // in view so it doesn't duplicate what's already on screen.
  if (!trigger) {
    bar.classList.add('visible');
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      bar.classList.toggle('visible', !entry.isIntersecting);
    },
    { threshold: 0 }
  );
  observer.observe(trigger);
}

/* ---------- PLP filter sidebar (mobile drawer + collapsible groups) ---------- */
function initFilterSidebar() {
  // Collapsible filter groups (desktop + mobile share the same markup)
  document.querySelectorAll('[data-filter-group-header]').forEach((header) => {
    header.addEventListener('click', () => {
      const group = header.closest('[data-filter-group]');
      group.classList.toggle('collapsed');
    });
  });

  // Mobile "Filters" button opens sidebar as a drawer
  const openBtn = document.querySelector('[data-filters-open]');
  const overlay = document.querySelector('[data-filters-overlay]');
  const closeBtn = document.querySelector('[data-filters-close]');
  const applyBtn = document.querySelector('[data-filters-apply]');
  if (!openBtn || !overlay) return;

  openBtn.addEventListener('click', () => overlay.classList.add('open'));
  closeBtn?.addEventListener('click', () => overlay.classList.remove('open'));
  applyBtn?.addEventListener('click', () => overlay.classList.remove('open'));
}

/* ---------- Load more (PLP pagination) ---------- */
function initLoadMore() {
  document.querySelectorAll('[data-load-more]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const hiddenRows = document.querySelectorAll('[data-grid-row].hidden-row');
      const batch = Array.from(hiddenRows).slice(0, 2);
      batch.forEach((row) => row.classList.remove('hidden-row'));
      if (document.querySelectorAll('[data-grid-row].hidden-row').length === 0) {
        btn.style.display = 'none';
      }
    });
  });
}
