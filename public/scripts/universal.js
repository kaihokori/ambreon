document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!menuToggle || !nav) return;

    const MENU_SRC = 'assets/icons/menu.svg';
    const CLOSE_SRC = 'assets/icons/close.svg';

    function openMenu() {
        nav.classList.add('open');
        document.body.classList.add('nav-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        const img = menuToggle.querySelector('img');
        if (img) img.src = CLOSE_SRC;
    }

    function closeMenu() {
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        const img = menuToggle.querySelector('img');
        if (img) img.src = MENU_SRC;
    }

    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        if (nav.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinks.forEach(function(a) {
        a.addEventListener('click', function() {
            if (nav.classList.contains('open')) closeMenu();
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeMenu();
        }
    });

    (function initServiceCarousel() {
        const sections = document.querySelectorAll('.services-carousel');
        sections.forEach(section => {
            const container = section.querySelector('.carousel');
            const prev = section.querySelector('.carousel-prev');
            const next = section.querySelector('.carousel-next');
            if (!container || !prev || !next) return;

            function scrollByAmount(amount) {
                container.scrollBy({ left: amount, behavior: 'smooth' });
            }

            // Use a sensible amount: a bit less than the visible width so user sees next cards
            function getStep() {
                return Math.max(240, Math.floor(container.clientWidth * 0.65));
            }

            function updateButtons() {
                const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
                // tolerate small float differences
                const atStart = container.scrollLeft <= 2;
                const atEnd = container.scrollLeft >= (maxScroll - 2);
                prev.disabled = atStart;
                next.disabled = atEnd;
                prev.setAttribute('aria-disabled', String(prev.disabled));
                next.setAttribute('aria-disabled', String(next.disabled));
            }

            // Throttle updates to animation frame for performance
            let ticking = false;
            container.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        updateButtons();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            prev.addEventListener('click', function() {
                scrollByAmount(-getStep());
            });

            next.addEventListener('click', function() {
                scrollByAmount(getStep());
            });

            // Keyboard support: allow arrow keys to scroll when a button is focused
            [prev, next].forEach(btn => {
                btn.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        scrollByAmount(-getStep());
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        scrollByAmount(getStep());
                    }
                });
            });

            // initial state
            updateButtons();
            // also update on resize in case container/client widths change
            window.addEventListener('resize', updateButtons);
        });
    })();
});