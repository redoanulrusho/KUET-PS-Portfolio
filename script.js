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

    // 6. Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const featuredProject = document.querySelector('.featured-project');

    const applyFilter = (filter) => {
        projectCards.forEach((card) => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || filter === category;
            card.style.display = shouldShow ? '' : 'none';
        });

        if (featuredProject) {
            const shouldShowFeatured = filter === 'all' || filter === 'arts';
            featuredProject.style.display = shouldShowFeatured ? '' : 'none';
        }
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            applyFilter(button.getAttribute('data-filter'));
        });
    });

    // 7. Gallery filtering
    const galleryFilterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const applyGalleryFilter = (filter) => {
        galleryItems.forEach((item) => {
            const category = item.getAttribute('data-gallery');
            const shouldShow = filter === 'all' || filter === category;
            item.style.display = shouldShow ? '' : 'none';
        });
    };

    if (galleryFilterButtons.length > 0) {
        galleryFilterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                galleryFilterButtons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                applyGalleryFilter(button.getAttribute('data-gallery-filter'));
            });
        });
    }

    // 8. Posts review loader
    const postReviewGrid = document.getElementById('postReviewGrid');
    const postSources = [
        {
            title: 'Frozen in Time 3.0',
            date: 'April 24, 2026',
            file: 'posts/pot1.txt'
        },
        {
            title: 'Arts of Bengal: Pohela Boishakh 1433',
            date: 'April 22, 2026',
            file: 'posts/post2.txt'
        }
    ];

    const parsePostText = (text) => {
        const lines = text
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
        const tags = lines.filter((line) => line.startsWith('#'));
        const bodyLines = lines.filter((line) => !line.startsWith('#'));
        const bodyText = bodyLines.join(' ');
        const sentenceMatches = bodyText.match(/[^.!?]+[.!?]+/g) || [bodyText];
        const excerpt = sentenceMatches.slice(0, 2).join(' ').trim();
        return { excerpt, tags };
    };

    const renderPostReview = (posts) => {
        if (!postReviewGrid) {
            return;
        }

        postReviewGrid.innerHTML = '';
        posts.forEach((post) => {
            const card = document.createElement('article');
            card.className = 'review-card';
            card.innerHTML = `
                <div class="review-meta">${post.date}</div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <div class="review-tags">
                    ${post.tags.map((tag) => `<span>${tag}</span>`).join('')}
                </div>
            `;
            postReviewGrid.appendChild(card);
        });
    };

    const loadPostReviews = async () => {
        if (!postReviewGrid) {
            return;
        }

        try {
            const posts = await Promise.all(
                postSources.map(async (source) => {
                    const response = await fetch(source.file);
                    const text = await response.text();
                    const parsed = parsePostText(text);
                    return { ...source, ...parsed };
                })
            );
            renderPostReview(posts);
        } catch (error) {
            postReviewGrid.innerHTML = `
                <article class="review-card">
                    <h3>Posts unavailable</h3>
                    <p>Open the site with a local server to load post previews.</p>
                </article>
            `;
        }
    };

    loadPostReviews();

    // 9. Event registration + calendar reminder
    const registrationForm = document.getElementById('eventRegistration');
    const eventSelect = document.getElementById('eventSelect');
    const addToCalendarBtn = document.getElementById('addToCalendar');
    const formStatus = document.getElementById('eventFormStatus');
    const timelineItems = document.querySelectorAll('.timeline-item');

    const events = Array.from(timelineItems).map((item) => ({
        id: item.getAttribute('data-event-id'),
        title: item.querySelector('h3')?.textContent?.trim() || 'KUET PS Event',
        date: item.getAttribute('data-date'),
        time: item.getAttribute('data-time') || '17:00',
        location: item.getAttribute('data-location') || 'KUET Campus',
        description: item.querySelector('p')?.textContent?.trim() || ''
    }));

    const buildEventOptions = () => {
        eventSelect.innerHTML = '<option value="" disabled selected>Select an event</option>';
        events.forEach((event) => {
            const option = document.createElement('option');
            option.value = event.id;
            option.textContent = `${event.title} (${event.date})`;
            eventSelect.appendChild(option);
        });
    };

    const formatIcsDate = (date, time) => {
        const safeTime = time.replace(':', '') + '00';
        return `${date.replace(/-/g, '')}T${safeTime}`;
    };

    const downloadCalendarInvite = (event) => {
        const start = formatIcsDate(event.date, event.time);
        const endTime = '90';
        const [hour, minute] = event.time.split(':').map(Number);
        const endDate = new Date(`${event.date}T${event.time}:00`);
        endDate.setMinutes(endDate.getMinutes() + Number(endTime));
        const end = formatIcsDate(event.date, `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`);
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//KUET PS//Event Reminder//EN',
            'BEGIN:VEVENT',
            `UID:${event.id}-${event.date}@kuetps`,
            `DTSTAMP:${start}`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:${event.title}`,
            `LOCATION:${event.location}`,
            `DESCRIPTION:${event.description}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${event.title.replace(/\s+/g, '-')}.ics`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    if (registrationForm && eventSelect) {
        buildEventOptions();

        eventSelect.addEventListener('change', () => {
            addToCalendarBtn.disabled = !eventSelect.value;
            formStatus.textContent = '';
        });

        addToCalendarBtn.addEventListener('click', () => {
            const selected = events.find((event) => event.id === eventSelect.value);
            if (selected) {
                downloadCalendarInvite(selected);
            }
        });

        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(registrationForm);
            const selected = events.find((item) => item.id === formData.get('eventId'));

            if (!selected) {
                formStatus.textContent = 'Please choose an event.';
                return;
            }

            const registrations = JSON.parse(localStorage.getItem('kuetpsRegistrations') || '[]');
            registrations.push({
                name: formData.get('fullName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                eventId: selected.id,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('kuetpsRegistrations', JSON.stringify(registrations));

            formStatus.textContent = `Registered for ${selected.title}. Download your calendar invite.`;
            registrationForm.reset();
            addToCalendarBtn.disabled = true;
        });
    }
});
