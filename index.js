gsap.registerPlugin(ScrollTrigger);

/* ===================================================
   LENIS SMOOTH SCROLL INTEGRATION
   =================================================== */
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ===================================================
   CUSTOM PREMIUM CURSOR LOGIC
   =================================================== */
const cursor = document.querySelector('.custom-cursor');
const dot = document.querySelector('.cursor-dot');
const circle = document.querySelector('.cursor-circle');

if (window.matchMedia('(pointer: fine)').matches && cursor) {
    cursor.style.display = 'block';

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant position for inner dot
        gsap.set(dot, { x: mouseX, y: mouseY });
    });

    // Inertia / Lag for the outer circle
    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.16, gsap.ticker.deltaRatio());
        circleX += (mouseX - circleX) * dt;
        circleY += (mouseY - circleY) * dt;
        gsap.set(circle, { x: circleX, y: circleY });
    });

    // Expanding states on hovering clickable components
    const hoverables = document.querySelectorAll('a, button, .accordion-header, .submit-btn, .polaroid-card, .magnetic-btn, .project-media img');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });
}

/* ===================================================
   AMBIENT BACKGROUND PARALLAX BLOBS
   =================================================== */
window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const xPercent = (clientX / window.innerWidth - 0.5) * 40;
    const yPercent = (clientY / window.innerHeight - 0.5) * 40;

    gsap.to('.blob1', { xPercent: xPercent * 0.6, yPercent: yPercent * 0.6, duration: 2, ease: 'power2.out' });
    gsap.to('.blob2', { xPercent: -xPercent * 0.6, yPercent: -yPercent * 0.6, duration: 2, ease: 'power2.out' });
    gsap.to('.blob3', { xPercent: xPercent * 0.3, yPercent: -yPercent * 0.3, duration: 2.5, ease: 'power2.out' });
});

/* ===================================================
   CINEMATIC LOADING SCREEN & PERCENTAGE LOADER
   =================================================== */
const loaderScreen = document.querySelector('.loader-screen');
const percentText = document.querySelector('.loader-percentage');
const loaderBar = document.querySelector('.loader-bar');
const loaderLogo = document.querySelector('.loader-logo');

// Temporary freeze scroll
lenis.stop();

const loadObj = { val: 0 };
const loaderTl = gsap.timeline({
    onComplete: () => {
        lenis.start();
        revealHero();
    }
});

loaderTl.to(loaderLogo, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out'
});

loaderTl.to(loadObj, {
    val: 100,
    duration: 2.4,
    ease: 'power2.out',
    onUpdate: () => {
        const rounded = Math.round(loadObj.val);
        percentText.textContent = rounded < 10 ? '0' + rounded : rounded;
        if (loaderBar) loaderBar.style.width = rounded + '%';
    }
}, '-=0.6');

loaderTl.to('.loader-content', {
    opacity: 0,
    y: -40,
    duration: 0.8,
    ease: 'power3.inOut'
});

loaderTl.to(loaderScreen, {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', // premium curtain reveal
    duration: 1.2,
    ease: 'power4.inOut'
}, '-=0.2');

/* ===================================================
   HERO ENTRANCE REVEALS
   =================================================== */
function revealHero() {
    const titleWords = document.querySelectorAll('.hero-title .title-word');
    const subtitle = document.querySelector('.hero-subtitle');
    const storyTag = document.querySelector('.hero-story-tag');
    const scrollInd = document.querySelector('.scroll-indicator');
    const heroPortrait = document.querySelector('.hero-bg-media');

    const heroTl = gsap.timeline();

    heroTl.to(heroPortrait, {
        opacity: 1,
        x: 0,
        duration: 1.6,
        ease: 'power3.out'
    });

    heroTl.to(storyTag, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=1.2');

    heroTl.to(titleWords, {
        y: '0%',
        duration: 1.2,
        stagger: 0.12,
        ease: 'power4.out'
    }, '-=1.0');

    heroTl.to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8');

    heroTl.to(scrollInd, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.6');
}

/* ===================================================
   HERO SCROLL PARALLAX
   =================================================== */
gsap.to('.hero-portrait', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

/* ===================================================
   ABOUT ME SECTION EFFECTS
   =================================================== */
// Scroll headline line-mask fade using SplitType
const aboutHeadline = new SplitType('.about-headline', { types: 'lines, words' });
if (aboutHeadline.words) {
    gsap.from(aboutHeadline.words, {
        opacity: 0.15,
        stagger: 0.02,
        duration: 1.2,
        scrollTrigger: {
            trigger: '.about-headline',
            start: 'top 85%',
            end: 'bottom 60%',
            scrub: true
        }
    });
}

// Fade in about details
gsap.from('.about-bio-text p, .about-values .value-item', {
    opacity: 0,
    y: 35,
    duration: 1,
    stagger: 0.18,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.about-bio-text',
        start: 'top 85%'
    }
});

// Biography photo scrolling parallax
gsap.to('.single-photo-wrapper', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

/* .card-2 is commented out in HTML
gsap.to('.card-2', {
    y: 50,
    rotate: 12,
    ease: 'none',
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});
*/

/* ===================================================
   SKILLS SECTION Tilt 3D
   =================================================== */
const skillCards = document.querySelectorAll('.skill-category-card');
skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 800
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out'
        });
    });
});

// Badges stagger reveal
gsap.from('.badge', {
    opacity: 0,
    scale: 0.8,
    y: 20,
    duration: 0.8,
    stagger: 0.08,
    ease: 'back.out(1.5)',
    scrollTrigger: {
        trigger: '.skills-badges',
        start: 'top 90%'
    }
});

/* ===================================================
   SERVICES ACCORDIONS
   =================================================== */
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        accordionItems.forEach(innerItem => {
            if (innerItem !== item && innerItem.classList.contains('active')) {
                innerItem.classList.remove('active');
                gsap.to(innerItem.querySelector('.accordion-content'), {
                    height: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.inOut'
                });
            }
        });

        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
            gsap.to(content, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut'
            });
        } else {
            item.classList.add('active');
            gsap.set(content, { height: 'auto' });
            const autoHeight = content.clientHeight;
            gsap.set(content, { height: 0, opacity: 0 });

            gsap.to(content, {
                height: autoHeight,
                opacity: 1,
                duration: 0.6,
                ease: 'power3.out'
            });
        }
    });
});

/* ===================================================
   TIMELINE DRAWING PROGRESS & DOTS
   =================================================== */
const timelineLine = document.querySelector('.timeline-line-progress');
if (timelineLine) {
    gsap.fromTo(timelineLine,
        { attr: { y2: '0%' } },
        {
            attr: { y2: '100%' },
            ease: 'none',
            scrollTrigger: {
                trigger: '.timeline-wrapper',
                start: 'top 30%',
                end: 'bottom 70%',
                scrub: true
            }
        }
    );
}

const timelineDots = document.querySelectorAll('.timeline-dot');
timelineDots.forEach(dot => {
    gsap.from(dot, {
        scale: 0,
        backgroundColor: 'var(--color-accent-light)',
        duration: 0.6,
        ease: 'back.out(2)',
        scrollTrigger: {
            trigger: dot,
            start: 'top 60%'
        }
    });
});

const timelineBoxes = document.querySelectorAll('.timeline-content-box');
timelineBoxes.forEach(box => {
    gsap.from(box, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: box,
            start: 'top 85%'
        }
    });
});

/* ===================================================
   MAGNETIC INTERACTION FOR PREMIUM BUTTONS
   =================================================== */
const magnetics = document.querySelectorAll('.magnetic-btn');
magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.35,
            y: y * 0.35,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1.1, 0.3)'
        });
    });
});

/* ===================================================
   MOBILE NAVIGATION MENU TOGGLING
   =================================================== */
const menuToggle = document.querySelector('.menu-toggle');
const mobileOverlay = document.querySelector('.mobile-menu-overlay');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

let menuOpen = false;
if (menuToggle && mobileOverlay) {
    menuToggle.addEventListener('click', () => {
        if (!menuOpen) {
            menuOpen = true;
            gsap.to(menuToggle.querySelectorAll('.line')[0], { rotate: 45, y: 4, duration: 0.3 });
            gsap.to(menuToggle.querySelectorAll('.line')[1], { rotate: -45, y: -4, duration: 0.3 });
            gsap.to(mobileOverlay, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' });
            lenis.stop();
        } else {
            menuOpen = false;
            gsap.to(menuToggle.querySelectorAll('.line')[0], { rotate: 0, y: 0, duration: 0.3 });
            gsap.to(menuToggle.querySelectorAll('.line')[1], { rotate: 0, y: 0, duration: 0.3 });
            gsap.to(mobileOverlay, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' });
            lenis.start();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOpen = false;
            gsap.to(menuToggle.querySelectorAll('.line')[0], { rotate: 0, y: 0, duration: 0.3 });
            gsap.to(menuToggle.querySelectorAll('.line')[1], { rotate: 0, y: 0, duration: 0.3 });
            gsap.to(mobileOverlay, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' });
            lenis.start();
        });
    });
}

// Scroll indicator click scroll to about section
const heroScrollInd = document.querySelector('.scroll-indicator');
if (heroScrollInd) {
    heroScrollInd.addEventListener('click', () => {
        lenis.scrollTo('#about');
    });
}

// Nav link clicking smoothly scrolls
const headerNavLinks = document.querySelectorAll('.nav-link');
headerNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const target = link.getAttribute('href');
        if (target.startsWith('#')) {
            e.preventDefault();
            lenis.scrollTo(target);
        }
    });
});

/* ===================================================
   PAGE 5 - CREATION SPLIT PANEL REVEAL (LANDING PAGE)
   =================================================== */

// Initial states for Page 5 content and headings
gsap.set(".page5 .content", { autoAlpha: 0, scale: 0.9, yPercent: 10 });
gsap.set("#topH", { yPercent: 50 });
gsap.set("#bottomH", { yPercent: -50 });

const page5Tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".page5",
        start: "top top",
        end: "+=1200", // snappy pinning distance
        scrub: 1,
        pin: true,
        anticipatePin: 1
    }
});

page5Tl.to("#top", { yPercent: -100, ease: "none", duration: 1 }, 0)
    .to("#bottom", { yPercent: 100, ease: "none", duration: 1 }, 0)
    .to("#topH", { yPercent: 100, ease: "none", duration: 1 }, 0)
    .to("#bottomH", { yPercent: -100, ease: "none", duration: 1 }, 0)
    .to(".page5 .content", { autoAlpha: 1, scale: 1, yPercent: 0, ease: "power2.out", duration: 1 }, 0.2)
    // Hold the content visible before scroll unpins
    .to({}, { duration: 0.5 });


/* ===================================================
   RESUME SECTION - GSAP TIMELINE
   =================================================== */

// Initial state for centered text overlay
gsap.set(".text", { opacity: 0, y: 100 });

var tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#resume",
        start: "50% 90%",
        end: "70% 10%",
        scrub: true,
        markers: true,
    }
})

tl.to("#imgTwo", {
    rotateX: "0deg",
    marginTop: "18.3%",

})
    .to("#imgThree", {
        rotateX: "0deg",
        marginTop: "18.3%",

    },'sa')
    .to(".resume", {
        scale: "0.5",
        minHeight: "90vh",
        y: "25%",
    }, 'sa')
    .to(".img", {
        filter: "grayscale(1)",
    }, 'saa')
    .to(".text", {
        opacity: 1,
        y: "25%",
    }, 'saa')
    .to(".overlay", {
        opacity: 1,
    }, 'saa')