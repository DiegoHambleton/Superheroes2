/* ══════════════════════════════════════════
   HEROVERSE — main.js
   Shared JS: dark mode, AOS, navbar, scroll
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── AOS Init ──
  AOS.init({ once: true, offset: 60 });

  // ── Dark / Light Mode Toggle ──
  const html = document.documentElement;
  const toggleBtn = document.getElementById('darkToggle');

  const savedTheme = localStorage.getItem('heroverse-theme') || 'dark';
  html.setAttribute('data-bs-theme', savedTheme);
  updateToggleIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-bs-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-bs-theme', next);
      localStorage.setItem('heroverse-theme', next);
      updateToggleIcon(next);
    });
  }

  function updateToggleIcon(theme) {
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'bi bi-moon-stars-fill';
      toggleBtn.title = 'Cambiar a modo claro';
    } else {
      icon.className = 'bi bi-sun-fill';
      toggleBtn.title = 'Cambiar a modo oscuro';
    }
  }

  // ── Navbar shrink on scroll ──
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav-scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Hero filter + search (pagina3) ──
  const searchInput = document.getElementById('heroSearch');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const heroCards   = document.querySelectorAll('.hero-card-wrapper');

  if (searchInput || filterBtns.length) {
    let activeFilter = 'all';

    function applyFilters() {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      heroCards.forEach(wrapper => {
        const name     = (wrapper.dataset.name || '').toLowerCase();
        const universe = (wrapper.dataset.universe || '').toLowerCase();
        const matchFilter = activeFilter === 'all' || universe === activeFilter;
        const matchSearch = !query || name.includes(query) || universe.includes(query);
        wrapper.style.display = (matchFilter && matchSearch) ? '' : 'none';

        // Animate in
        if (matchFilter && matchSearch) {
          wrapper.classList.add('aos-animate');
        }
      });

      // Empty state
      const visible = [...heroCards].filter(w => w.style.display !== 'none');
      const emptyMsg = document.getElementById('noResults');
      if (emptyMsg) emptyMsg.classList.toggle('d-none', visible.length > 0);
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active', 'btn-danger'));
        btn.classList.add('active', 'btn-danger');
        activeFilter = btn.dataset.filter;
        applyFilters();
      });
    });
  }

  // ── Modal dynamic content (pagina3) ──
  const heroModal = document.getElementById('heroModal');
  if (heroModal) {
    heroModal.addEventListener('show.bs.modal', e => {
      const trigger = e.relatedTarget;
      if (!trigger) return;
      heroModal.querySelector('#modalHeroName').textContent  = trigger.dataset.name  || '';
      heroModal.querySelector('#modalHeroUniverse').textContent = trigger.dataset.universe || '';
      heroModal.querySelector('#modalHeroDesc').textContent  = trigger.dataset.desc  || '';
      heroModal.querySelector('#modalHeroFact').textContent  = trigger.dataset.fact  || '';
      const img = heroModal.querySelector('#modalHeroImg');
      img.src = trigger.dataset.img || '';
      img.alt = trigger.dataset.name || '';
    });
  }

  // ── Scroll-to-top button ──
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  scrollTopBtn.className = 'scroll-top-btn btn btn-danger btn-sm rounded-circle';
  scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
  scrollTopBtn.style.cssText = `
    position:fixed; bottom:1.5rem; right:1.5rem;
    width:42px; height:42px; opacity:0; pointer-events:none;
    transition:opacity 0.3s; z-index:999; font-size:1rem;
    display:flex; align-items:center; justify-content:center;
  `;
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    scrollTopBtn.style.opacity    = show ? '1' : '0';
    scrollTopBtn.style.pointerEvents = show ? 'auto' : 'none';
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Nav-scrolled CSS ──
  const style = document.createElement('style');
  style.textContent = `
    #mainNav.nav-scrolled {
      background-color: rgba(0,0,0,0.98) !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    [data-bs-theme="light"] #mainNav.nav-scrolled {
      background-color: rgba(255,255,255,0.98) !important;
    }
  `;
  document.head.appendChild(style);

  // ── Survey form feedback (pagina5) ──
  const surveyForm = document.getElementById('surveyForm');
  if (surveyForm) {
    surveyForm.addEventListener('submit', e => {
      e.preventDefault();
      const successMsg = document.getElementById('surveySuccess');
      surveyForm.classList.add('d-none');
      if (successMsg) successMsg.classList.remove('d-none');
    });
  }

});