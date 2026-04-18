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
});
