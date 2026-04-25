document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation (fades in elements as you scroll)
    const revealElements = document.querySelectorAll('.reveal');
    const exposeOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => exposeOnScroll.observe(el));

    // 2. Back to Top Button visibility & click action
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. Highlight Active Navigation Link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. Copy to Clipboard for Contact Items
    const copyItems = document.querySelectorAll('.contact-item.copy');
    copyItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jump to top
            const textToCopy = item.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('Copied to clipboard: ' + textToCopy);
                });
            }
        });
    });

    // 5. Gallery image viewer with back-button support
    const viewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerClose = document.querySelector('.viewer-close');
    const viewerBackdrop = document.querySelector('.viewer-backdrop');
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    const galleryDetails = document.querySelectorAll('.gallery-details');

    galleryDetails.forEach((detail) => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                galleryDetails.forEach((other) => {
                    if (other !== detail) {
                        other.open = false;
                    }
                });
            }
        });
    });

    const closeViewer = () => {
        viewer.classList.remove('show');
        viewer.setAttribute('aria-hidden', 'true');
        viewerImage.src = '';
    };

    const openViewer = (src, alt) => {
        viewerImage.src = src;
        viewerImage.alt = alt || 'Expanded gallery image';
        viewer.classList.add('show');
        viewer.setAttribute('aria-hidden', 'false');
        history.pushState({ galleryOpen: true }, '');
    };

    galleryThumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => {
            openViewer(thumb.src, thumb.alt);
        });
    });

    viewerClose.addEventListener('click', () => {
        if (viewer.classList.contains('show')) {
            history.back();
        }
    });

    viewerBackdrop.addEventListener('click', () => {
        if (viewer.classList.contains('show')) {
            history.back();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && viewer.classList.contains('show')) {
            history.back();
        }
    });

    window.addEventListener('popstate', () => {
        if (viewer.classList.contains('show')) {
            closeViewer();
        }
    });
});
