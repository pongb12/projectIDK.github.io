/* ===========================
   QuizArena — script.js
=========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Quiz iframe loading ── */
  const frame   = document.getElementById('quizFrame');
  const loading = document.getElementById('quizLoading');

  if (frame && loading) {
    frame.addEventListener('load', () => {
      loading.classList.add('hidden');
    });
    // Fallback: hide loader after 8s
    setTimeout(() => loading.classList.add('hidden'), 8000);
  }

  /* ── Share button ── */
  const btnShare = document.getElementById('btnShare');
  const toast    = document.getElementById('toast');

  if (btnShare && toast) {
    btnShare.addEventListener('click', async () => {
      const url = window.location.href;
      try {
        if (navigator.share) {
          await navigator.share({ title: 'QuizArena', url });
        } else {
          await navigator.clipboard.writeText(url);
          showToast();
        }
      } catch {
        // user cancelled or clipboard failed
      }
    });
  }

  function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  /* ── Scroll-reveal for feature cards ── */
  const cards = document.querySelectorAll('.feature-card');
  if ('IntersectionObserver' in window && cards.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = (i * 0.1) + 's';
          entry.target.classList.add('reveal');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    // Add reveal styles dynamically
    const style = document.createElement('style');
    style.textContent = `
      .feature-card { opacity: 0; transform: translateY(20px); }
      .feature-card.reveal {
        animation: fadeUp 0.6s forwards;
      }
    `;
    document.head.appendChild(style);

    cards.forEach(c => obs.observe(c));
  }

  /* ── Smooth active nav highlighting ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navLinks.length) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${id}`
              ? 'var(--text)'
              : '';
          });
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(s => navObs.observe(s));
  }

  /* ── Parallax on blobs (subtle) ── */
  let ticking = false;
  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 20;
      const cy = (e.clientY / window.innerHeight - 0.5) * 20;
      document.querySelector('.blob-1').style.transform = `translate(${cx}px, ${cy}px)`;
      document.querySelector('.blob-2').style.transform = `translate(${-cx}px, ${-cy}px)`;
      ticking = false;
    });
  });

});
