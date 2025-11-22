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

    // Language selection: persist choice, update document language and UI texts
    (function initLanguageSelect() {
        const LANG_KEY = 'ambreon-lang';
        const selects = Array.from(document.querySelectorAll('select[name="language"], select#language-select'));
        if (!selects.length) return;

        // Translation dictionary for home page UI
        const TRANSLATIONS = {
            meta: {
                title: {
                    en: 'Ambreon - Software Development and Consulting',
                    de: 'Ambreon - Softwareentwicklung und Beratung',
                    es: 'Ambreon - Desarrollo de Software y Consultoría',
                    fr: 'Ambreon - Développement logiciel et conseil',
                    id: 'Ambreon - Pengembangan Perangkat Lunak dan Konsultasi'
                }
            },
            nav: {
                home: { en: 'Home', de: 'Start', es: 'Inicio', fr: 'Accueil', id: 'Beranda' },
                work: { en: 'Work', de: 'Projekte', es: 'Proyectos', fr: 'Projets', id: 'Pekerjaan' },
                services: { en: 'Services', de: 'Dienstleistungen', es: 'Servicios', fr: 'Services', id: 'Layanan' },
                about: { en: 'About', de: 'Über uns', es: 'Acerca', fr: 'À propos', id: 'Tentang' },
                book: { en: 'Book a Call', de: 'Termin buchen', es: 'Reservar llamada', fr: 'Réserver un appel', id: 'Pesan Panggilan' }
            },
            hero: {
                line1: { en: 'Technology Becomes', de: 'Technologie Wird', es: 'La tecnología se vuelve', fr: 'La technologie devient', id: 'Teknologi Menjadi' },
                line2: { en: 'Timeless', de: 'Zeitlos', es: 'Atemporal', fr: 'Intemporelle', id: 'Abadi' },
                lead: { en: 'Your trusted partner for innovative software design and development solutions.', de: 'Ihr vertrauenswürdiger Partner für innovative Software-Design- und Entwicklungslösungen.', es: 'Su socio de confianza para soluciones innovadoras de diseño y desarrollo de software.', fr: 'Votre partenaire de confiance pour des solutions innovantes de conception et de développement logiciel.', id: 'Mitra tepercaya Anda untuk solusi desain dan pengembangan perangkat lunak yang inovatif.' },
                more: { en: 'More examples', de: 'Mehr Beispiele', es: 'Más ejemplos', fr: 'Plus d\'exemples', id: 'Lebih banyak contoh' }
            },
            weare: {
                key: { en: 'We Are Ambreon', de: 'Wir sind Ambreon', es: 'Somos Ambreon', fr: 'Nous sommes Ambreon', id: 'Kami Ambreon' },
                heading: { en: 'Transforming Ideas into Reality', de: 'Ideen in die Realität verwandeln', es: 'Transformando ideas en realidad', fr: 'Transformer les idées en réalité', id: 'Mengubah Ide menjadi Kenyataan' },
                content: { en: 'We build and maintain cutting edge software solutions that drive success and innovation for businesses worldwide, using the latest technologies and industry best practices to deliver exceptional results.', de: 'Wir entwickeln und betreiben hochmoderne Softwarelösungen, die Erfolg und Innovation für Unternehmen weltweit vorantreiben, unter Verwendung neuester Technologien und Best Practices.', es: 'Construimos y mantenemos soluciones de software de vanguardia que impulsan el éxito y la innovación para empresas en todo el mundo, utilizando las últimas tecnologías y mejores prácticas.', fr: 'Nous concevons et maintenons des solutions logicielles de pointe qui stimulent le succès et l\'innovation pour les entreprises du monde entier, en utilisant les dernières technologies et meilleures pratiques.', id: 'Kami membangun dan memelihara solusi perangkat lunak mutakhir yang mendorong keberhasilan dan inovasi bagi bisnis di seluruh dunia, menggunakan teknologi terbaru dan praktik terbaik industri.' }
            },
            work: { 
                recent: { en: 'Most Recent Milestone', de: 'Neuester Meilenstein', es: 'Hito más reciente', fr: 'Dernier jalon', id: 'Tonggak Terbaru' },
                example: {
                    key: {
                        en: 'AI + Workflow Development',
                        de: 'KI + Workflow-Entwicklung',
                        es: 'IA + Desarrollo de flujo de trabajo',
                        fr: 'IA + Développement de flux de travail',
                        id: 'AI + Pengembangan Alur Kerja'
                    },
                    heading: {
                        en: 'Nifty',
                        de: 'Nifty',
                        es: 'Nifty',
                        fr: 'Nifty',
                        id: 'Nifty'
                    },
                    content: {
                        en: 'An AI-powered chatbot designed to streamline hotel customer service, enhancing guest experiences through instant, personalized interactions for bookings, inquiries, and support.',
                        de: 'Ein KI-basierter Chatbot zur Optimierung des Hotelkundenservice, der Gästeerlebnisse durch sofortige, personalisierte Interaktionen für Buchungen, Anfragen und Support verbessert.',
                        es: 'Un chatbot impulsado por IA diseñado para optimizar el servicio al cliente hotelero, mejorando la experiencia del huésped mediante interacciones instantáneas y personalizadas para reservas, consultas y soporte.',
                        fr: 'Un chatbot alimenté par l\'IA conçu pour rationaliser le service client hôtelier, améliorant l\'expérience des clients grâce à des interactions instantanées et personnalisées pour les réservations, les demandes et le support.',
                        id: 'Sebuah chatbot bertenaga AI yang dirancang untuk menyederhanakan layanan pelanggan hotel, meningkatkan pengalaman tamu melalui interaksi instan dan personal untuk pemesanan, pertanyaan, dan dukungan.'
                    }
                }
            },
            services: {
                title: { en: 'Our Services', de: 'Unsere Dienstleistungen', es: 'Nuestros Servicios', fr: 'Nos Services', id: 'Layanan Kami' },
                ai: { title: { en: 'AI Creation', de: 'KI-Erstellung', es: 'Creación de IA', fr: 'Création d\'IA', id: 'Pembuatan AI' }, desc: { en: 'Custom AI models and automation for smarter products.', de: 'Maßgeschneiderte KI-Modelle und Automatisierung für intelligentere Produkte.', es: 'Modelos de IA personalizados y automatización para productos más inteligentes.', fr: 'Modèles d\'IA personnalisés et automatisation pour des produits plus intelligents.', id: 'Model AI kustom dan otomatisasi untuk produk yang lebih cerdas.' } },
                automation: { title: { en: 'Automation', de: 'Automatisierung', es: 'Automatización', fr: 'Automatisation', id: 'Otomatisasi' }, desc: { en: 'Workflow automation that saves time and reduces errors.', de: 'Workflow-Automatisierung, die Zeit spart und Fehler reduziert.', es: 'Automatización de flujos de trabajo que ahorra tiempo y reduce errores.', fr: 'Automatisation des flux de travail qui fait gagner du temps et réduit les erreurs.', id: 'Otomatisasi alur kerja yang menghemat waktu dan mengurangi kesalahan.' } },
                website: { title: { en: 'Websites', de: 'Websites', es: 'Sitios web', fr: 'Sites Web', id: 'Situs Web' }, desc: { en: 'Fast, accessible websites tailored to your brand.', de: 'Schnelle, zugängliche Websites, die auf Ihre Marke zugeschnitten sind.', es: 'Sitios web rápidos y accesibles adaptados a su marca.', fr: 'Sites rapides et accessibles adaptés à votre marque.', id: 'Situs web cepat dan dapat diakses yang disesuaikan dengan merek Anda.' } },
                mobile: { title: { en: 'Mobile Apps', de: 'Mobile Apps', es: 'Aplicaciones móviles', fr: 'Applications mobiles', id: 'Aplikasi Seluler' }, desc: { en: 'iOS & Android apps built for scale and performance.', de: 'iOS- und Android-Apps für Skalierung und Leistung entwickelt.', es: 'Aplicaciones iOS y Android diseñadas para escalabilidad y rendimiento.', fr: 'Applications iOS et Android conçues pour l\'échelle et la performance.', id: 'Aplikasi iOS & Android dibangun untuk skala dan kinerja.' } },
                ios: { title: { en: 'iOS Native Apps', de: 'iOS Native Apps', es: 'Aplicaciones nativas iOS', fr: 'Applications natives iOS', id: 'Aplikasi Native iOS' }, desc: { en: 'High-performance iPhone apps using Swift and SwiftUI.', de: 'Leistungsstarke iPhone-Apps mit Swift und SwiftUI.', es: 'Aplicaciones de iPhone de alto rendimiento usando Swift y SwiftUI.', fr: 'Applications iPhone haute performance utilisant Swift et SwiftUI.', id: 'Aplikasi iPhone berkinerja tinggi menggunakan Swift dan SwiftUI.' } },
                backend: { title: { en: 'Backend', de: 'Backend', es: 'Backend', fr: 'Backend', id: 'Backend' }, desc: { en: 'Robust server-side systems and APIs.', de: 'Robuste serverseitige Systeme und APIs.', es: 'Sistemas robustos del lado del servidor y APIs.', fr: 'Systèmes côté serveur robustes et API.', id: 'Sistem sisi-server yang kuat dan API.' } },
                java: { title: { en: 'Java', de: 'Java', es: 'Java', fr: 'Java', id: 'Java' }, desc: { en: 'Enterprise-grade applications built with Java.', de: 'Enterprise-Grade-Anwendungen mit Java entwickelt.', es: 'Aplicaciones de nivel empresarial construidas con Java.', fr: 'Applications de qualité entreprise construites avec Java.', id: 'Aplikasi kelas perusahaan dibangun dengan Java.' } },
                python: { title: { en: 'Python', de: 'Python', es: 'Python', fr: 'Python', id: 'Python' }, desc: { en: 'Data-driven solutions and automation with Python.', de: 'Datengetriebene Lösungen und Automatisierung mit Python.', es: 'Soluciones impulsadas por datos y automatización con Python.', fr: 'Solutions pilotées par les données et automatisation avec Python.', id: 'Solusi berbasis data dan otomasi dengan Python.' } },
                uiux: { title: { en: 'UI/UX Design', de: 'UI/UX-Design', es: 'Diseño UI/UX', fr: 'Conception UI/UX', id: 'Desain UI/UX' }, desc: { en: 'Human-centered interfaces that delight users.', de: 'Menschzentrierte Schnittstellen, die Nutzer begeistern.', es: 'Interfaces centradas en el usuario que encantan a los usuarios.', fr: 'Interfaces centrées sur l\'humain qui séduisent les utilisateurs.', id: 'Antarmuka berfokus pada manusia yang menyenangkan pengguna.' } },
                consulting: { title: { en: 'Consulting', de: 'Beratung', es: 'Consultoría', fr: 'Conseil', id: 'Konsultasi' }, desc: { en: 'Strategy, architecture and delivery planning.', de: 'Strategie, Architektur und Lieferplanung.', es: 'Estrategia, arquitectura y planificación de entrega.', fr: 'Stratégie, architecture et planification de livraison.', id: 'Strategi, arsitektur, dan perencanaan pengiriman.' } },
                marketing: { title: { en: 'Marketing', de: 'Marketing', es: 'Marketing', fr: 'Marketing', id: 'Pemasaran' }, desc: { en: 'Growth and acquisition strategies for digital products.', de: 'Wachstums- und Akquisitionsstrategien für digitale Produkte.', es: 'Estrategias de crecimiento y adquisición para productos digitales.', fr: 'Stratégies de croissance et d\'acquisition pour les produits numériques.', id: 'Strategi pertumbuhan dan akuisisi untuk produk digital.' } }
            },
            tech: { title: { en: 'Applied Technologies', de: 'Angewandte Technologien', es: 'Tecnologías Aplicadas', fr: 'Technologies Appliquées', id: 'Teknologi Terapan' } },
            reviews: { title: { en: 'Reviews', de: 'Bewertungen', es: 'Reseñas', fr: 'Avis', id: 'Ulasan' } },
            why: {
                title: { en: 'Why Choose Us', de: 'Warum uns wählen', es: 'Por qué elegirnos', fr: 'Pourquoi nous choisir', id: 'Mengapa Memilih Kami' },
                expertise: {
                    heading: { en: 'Integrated Expertise', de: 'Integrierte Expertise', es: 'Experiencia integrada', fr: 'Expertise intégrée', id: 'Keahlian Terpadu' },
                    content: { en: 'We combine AI, design, and development in one team so we can deliver end-to-end solutions that are cohesive, efficient, and aligned with your business goals.', de: 'Wir kombinieren KI, Design und Entwicklung in einem Team, um End-to-End-Lösungen zu liefern, die kohärent, effizient und auf Ihre Geschäftsziele ausgerichtet sind.', es: 'Combinamos IA, diseño y desarrollo en un solo equipo para ofrecer soluciones de extremo a extremo que sean coherentes, eficientes y alineadas con sus objetivos comerciales.', fr: 'Nous combinons IA, design et développement au sein d\'une même équipe afin de fournir des solutions de bout en bout cohérentes, efficaces et alignées sur vos objectifs commerciaux.', id: 'Kami menggabungkan AI, desain, dan pengembangan dalam satu tim sehingga kami dapat menyediakan solusi ujung ke ujung yang kohesif, efisien, dan selaras dengan tujuan bisnis Anda.' }
                },
                custom: {
                    heading: { en: 'Customised Products', de: 'Maßgeschneiderte Produkte', es: 'Productos personalizados', fr: 'Produits personnalisés', id: 'Produk yang Disesuaikan' },
                    content: { en: 'Every solution we build is tailored to your context. We don’t believe in one-size-fits-all: your growth strategy is unique, and so is our approach.', de: 'Jede von uns entwickelte Lösung ist auf Ihren Kontext zugeschnitten. Wir glauben nicht an Einheitslösungen: Ihre Wachstumsstrategie ist einzigartig, ebenso wie unser Ansatz.', es: 'Cada solución que construimos está adaptada a su contexto. No creemos en soluciones universales: su estrategia de crecimiento es única, y también lo es nuestro enfoque.', fr: 'Chaque solution que nous construisons est adaptée à votre contexte. Nous ne croyons pas au format unique : votre stratégie de croissance est unique, tout comme notre approche.', id: 'Setiap solusi yang kami bangun disesuaikan dengan konteks Anda. Kami tidak percaya pada satu solusi untuk semua: strategi pertumbuhan Anda unik, begitu juga pendekatan kami.' }
                },
                support: {
                    heading: { en: 'Support and Collaborative', de: 'Unterstützung und Zusammenarbeit', es: 'Soporte y Colaboración', fr: 'Support et collaboration', id: 'Dukungan dan Kolaborasi' },
                    content: { en: 'We work with you in an iterative way: we ideate, build, test, and refine. Your feedback is essential. We want to co-create, not just deliver.', de: 'Wir arbeiten iterativ mit Ihnen zusammen: Wir entwickeln Ideen, bauen, testen und verfeinern. Ihr Feedback ist wesentlich. Wir wollen mitgestalten, nicht nur liefern.', es: 'Trabajamos con usted de manera iterativa: ideamos, construimos, probamos y refinamos. Sus comentarios son esenciales. Queremos co-crear, no solo entregar.', fr: 'Nous travaillons avec vous de manière itérative : nous imaginons, construisons, testons et affinons. Vos retours sont essentiels. Nous souhaitons co-créer, pas seulement livrer.', id: 'Kami bekerja bersama Anda secara iteratif: merancang ide, membangun, menguji, dan menyempurnakan. Masukan Anda sangat penting. Kami ingin berkolaborasi, bukan hanya menyerahkan.' }
                },
                partnership: {
                    heading: { en: 'Long-Term Partnership', de: 'Langfristige Partnerschaft', es: 'Asociación a largo plazo', fr: 'Partenariat à long terme', id: 'Kemitraan Jangka Panjang' },
                    content: { en: 'Our relationship doesn’t end after launch. We’re here for maintenance, scaling, optimization, and strategic guidance as you grow.', de: 'Unsere Beziehung endet nicht nach dem Launch. Wir sind hier für Wartung, Skalierung, Optimierung und strategische Beratung, wenn Sie wachsen.', es: 'Nuestra relación no termina después del lanzamiento. Estamos aquí para mantenimiento, escalado, optimización y orientación estratégica a medida que crece.', fr: 'Notre relation ne s\'arrête pas après le lancement. Nous sommes là pour la maintenance, la montée en charge, l\'optimisation et l\'accompagnement stratégique à mesure que vous évoluez.', id: 'Hubungan kami tidak berakhir setelah peluncuran. Kami ada untuk pemeliharaan, penskalaan, optimisasi, dan panduan strategis saat Anda tumbuh.' }
                }
            },
            kpi: {
                projects: { en: 'Successful Projects', de: 'Erfolgreiche Projekte', es: 'Proyectos exitosos', fr: 'Projets réussis', id: 'Proyek Sukses' },
                clients: { en: 'Satisfied Clients', de: 'Zufriedene Kunden', es: 'Clientes satisfechos', fr: 'Clients satisfaits', id: 'Klien Puas' },
                uptime: { en: 'Uptime Reliability', de: 'Zuverlässige Betriebszeit', es: 'Fiabilidad de tiempo de actividad', fr: 'Fiabilité de disponibilité', id: 'Keandalan Waktu Aktif' }
            },
            
            service: {
                see: { en: 'See Details', de: 'Details anzeigen', es: 'Ver detalles', fr: 'Voir les détails', id: 'Lihat Detail' }
            },
            contact: {
                cta: { en: "Let's get started", de: 'Los geht\'s', es: 'Comencemos', fr: 'Commençons', id: 'Mari mulai' },
                body: { en: "Whatever your needs, we're here to help.", de: 'Was auch immer Ihre Bedürfnisse sind, wir sind hier, um zu helfen.', es: 'Cualesquiera que sean sus necesidades, estamos aquí para ayudar.', fr: 'Quelles que soient vos besoins, nous sommes là pour aider.', id: 'Apa pun kebutuhan Anda, kami siap membantu.' },
                book: { en: 'Book a Call', de: 'Termin buchen', es: 'Reservar llamada', fr: 'Réserver un appel', id: 'Pesan Panggilan' }
            },
            footer: { copyright: { en: '2025 © Ambreon. All rights reserved.', de: '2025 © Ambreon. Alle Rechte vorbehalten.', es: '2025 © Ambreon. Todos los derechos reservados.', fr: '2025 © Ambreon. Tous droits réservés.', id: '2025 © Ambreon. Semua hak dilindungi.' } }
        };

        function translateKey(key, lang) {
            if (!key) return null;
            const parts = key.split('.');
            let cur = TRANSLATIONS;
            for (let p of parts) {
                if (!cur) return null;
                cur = cur[p];
            }
            if (!cur) return null;
            return cur[lang] || cur['en'] || null;
        }

        function applyLanguage(lang) {
            if (!lang) return;
            try { document.documentElement.lang = lang; } catch (e) { /* ignore */ }
            selects.forEach(s => { if (s.value !== lang) s.value = lang; });

            // Update all elements with data-i18n
            const items = document.querySelectorAll('[data-i18n]');
            items.forEach(el => {
                const key = el.getAttribute('data-i18n');
                const text = translateKey(key, lang);
                if (text != null) {
                    if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                        el.placeholder = text;
                    } else if (el.tagName.toLowerCase() === 'title') {
                        document.title = text;
                    } else {
                        el.textContent = text;
                    }
                }
            });

            // Also update document.title if meta.title exists
            const metaTitle = translateKey('meta.title', lang);
            if (metaTitle) document.title = metaTitle;
        }

        // load stored language or fall back to navigator / html attr
        const stored = localStorage.getItem(LANG_KEY);
        const initial = stored || (document.documentElement.lang || navigator.language || 'en').slice(0,2);
        applyLanguage(initial);

        // attach change handlers
        selects.forEach(s => {
            s.addEventListener('change', function() {
                const val = String(this.value || '').slice(0,2);
                localStorage.setItem(LANG_KEY, val);
                applyLanguage(val);
            });
        });
    })();
});