// Dynamic Theme Switcher
function setTheme(themeName) { 
  document.body.setAttribute('data-theme', themeName); 
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menuBtn = document.getElementById('menuToggleBtn');
  const menuIcon = document.getElementById('menuIcon');
  const mobileMenu = document.getElementById('mobileMenu');
  
  menuBtn.classList.toggle('menu-open');
  if (mobileMenu.classList.contains('inactive')) {
    mobileMenu.classList.remove('inactive');
    mobileMenu.classList.add('active');
    if (menuIcon) {
      menuIcon.className = 'fa-solid fa-xmark text-base font-bold';
    }
  } else {
    mobileMenu.classList.remove('active');
    mobileMenu.classList.add('inactive');
    if (menuIcon) {
      menuIcon.className = 'fa-solid fa-bars-staggered text-sm font-bold';
    }
  }
}

// Lenis Smooth Scroll Initialization (ALL DEVICES - DESKTOP & MOBILE SMOOTH GLIDE)
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({ 
    duration: 1.25, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smoothWheel: true,
    smoothTouch: true, // Ultra-smooth inertia glide on mobile touch devices
    touchMultiplier: 1.75, // Natural, responsive touch friction multiplier
    orientation: 'vertical',
    gestureOrientation: 'vertical'
  });

  function raf(time) { 
    if (lenis) lenis.raf(time); 
    requestAnimationFrame(raf); 
  }
  requestAnimationFrame(raf);
}

// DOM Elements
const mainHeader = document.getElementById('mainHeader');
const startElem = document.getElementById('imgStartPlaceholder');
const endElem = document.getElementById('imgEndTarget');
const archFrame = document.getElementById('archFrame');
const morphContainer = document.getElementById('image-morph-container');
const textureOverlay = document.getElementById('textureOverlay');
const floatingBar = document.getElementById('floatingBar');

const arrowPath = document.getElementById('arrowPath');
const pathLength = arrowPath ? arrowPath.getTotalLength() : 0;

if (arrowPath) {
  arrowPath.style.strokeDasharray = `${pathLength}`;
  arrowPath.style.strokeDashoffset = pathLength;
}

let timer = null;

// Dynamic Position Calculations with Rect Caching for Zero-Lag Mobile Performance
let cachedStartRect = null;
let cachedEndRect = null;
let cachedArchRect = null;

function cacheDOMRects() {
  if (startElem) {
    const r = startElem.getBoundingClientRect();
    cachedStartRect = { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height };
  }
  if (endElem) {
    const r = endElem.getBoundingClientRect();
    cachedEndRect = { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height };
  }
  if (archFrame) {
    const r = archFrame.getBoundingClientRect();
    cachedArchRect = { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height };
  }
}

function updatePositions() {
  const scrollY = window.scrollY;

  // Header State
  if (mainHeader) {
    if (scrollY > 50) { 
      mainHeader.classList.remove('header-at-top'); 
      mainHeader.classList.add('header-scrolled'); 
    } else { 
      mainHeader.classList.remove('header-scrolled'); 
      mainHeader.classList.add('header-at-top'); 
    }
  }

  const maxScroll = 380;
  const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

  // Hero Arrow Drawing Effect
  if (arrowPath) {
    const arrowProgress = Math.min(Math.max((scrollY - 10) / 320, 0), 1);
    arrowPath.style.strokeDashoffset = pathLength * (1 - arrowProgress);
  }
}

// OPTION 3: INTERACTIVE 3D TILT ARCH CONTROLLER
function init3DTiltArch() {
  const card = document.getElementById('tiltArchCard');
  const stage = document.getElementById('tiltArchStage');
  if (!card || !stage) return;

  function handleMove(e) {
    const rect = card.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
    card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
    card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
  }

  function handleLeave() {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  }

  stage.addEventListener('mousemove', handleMove);
  stage.addEventListener('mouseleave', handleLeave);
  stage.addEventListener('touchmove', handleMove, { passive: true });
  stage.addEventListener('touchend', handleLeave, { passive: true });
}

// 🌟 ULTRA-COOL 3D HERO TICKER FLIPPER CONTROLLER
const heroTickerItems = [
  { icon: '🎨', text: 'UI/UX Design', gradient: 'from-theme-primary to-purple-600' },
  { icon: '💻', text: 'Full-Stack Web', gradient: 'from-blue-600 to-cyan-500' },
  { icon: '🚀', text: 'Web Funnels', gradient: 'from-emerald-600 to-teal-500' },
  { icon: '⚡', text: 'Custom Apps', gradient: 'from-amber-500 to-rose-500' },
  { icon: '💎', text: 'Next-Gen UI', gradient: 'from-purple-600 to-pink-500' }
];

let currentHeroTickerIndex = 0;
let heroTickerTimer = null;

function cycleHeroTicker() {
  const tickerEl = document.getElementById('heroTickerItem');
  if (!tickerEl) return;

  currentHeroTickerIndex = (currentHeroTickerIndex + 1) % heroTickerItems.length;
  const nextItem = heroTickerItems[currentHeroTickerIndex];

  // 3D Flip Up & Blur Out
  tickerEl.style.transform = 'rotateX(85deg) translateY(-100%)';
  tickerEl.style.opacity = '0';
  tickerEl.style.filter = 'blur(4px)';

  setTimeout(() => {
    tickerEl.innerHTML = `
      <span class="text-theme-primary text-xs sm:text-sm">${nextItem.icon}</span>
      <span class="bg-gradient-to-r ${nextItem.gradient} bg-clip-text text-transparent">${nextItem.text}</span>
    `;
    tickerEl.style.transition = 'none';
    tickerEl.style.transform = 'rotateX(-85deg) translateY(100%)';
    
    // Force Reflow
    void tickerEl.offsetWidth;

    tickerEl.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease, filter 0.6s ease';
    tickerEl.style.transform = 'rotateX(0deg) translateY(0%)';
    tickerEl.style.opacity = '1';
    tickerEl.style.filter = 'blur(0px)';
  }, 320);
}

function cycleHeroTickerManual() {
  clearInterval(heroTickerTimer);
  cycleHeroTicker();
  heroTickerTimer = setInterval(cycleHeroTicker, 2600);
}

function initHeroTicker() {
  const tickerEl = document.getElementById('heroTickerItem');
  if (!tickerEl) return;
  clearInterval(heroTickerTimer);
  heroTickerTimer = setInterval(cycleHeroTicker, 2600);
}

// ⚡ CRISP & ELEGANT SKILLS FILTERING (ZERO DELAY, NO MUDDY BLUR)
function blurFilterSkills(category) {
  const tabs = document.querySelectorAll('.skill-tab-btn');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-skill-tab') === category) {
      tab.classList.add('active-tab');
      tab.style.borderColor = 'var(--color-primary, #9333ea)';
      tab.style.backgroundColor = 'var(--color-primary, #9333ea)';
      tab.style.color = '#ffffff';
      tab.style.boxShadow = '0 4px 14px rgba(147, 51, 234, 0.35)';
    } else {
      tab.classList.remove('active-tab');
      tab.style.borderColor = '';
      tab.style.backgroundColor = '';
      tab.style.color = '';
      tab.style.boxShadow = '';
    }
  });

  const skillIcons = document.querySelectorAll('.glass-icon-btn, .skill-icon-badge');

  skillIcons.forEach(icon => {
    const iconCategory = icon.getAttribute('data-category');
    icon.style.transitionDelay = '0s'; // Instant unified transition

    if (category === 'all') {
      icon.classList.remove('dimmed-skill', 'focused-skill');
    } else if (iconCategory === category) {
      icon.classList.remove('dimmed-skill');
      icon.classList.add('focused-skill');
    } else {
      icon.classList.remove('focused-skill');
      icon.classList.add('dimmed-skill');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init3DTiltArch();
});

// SECTION 4: STACKED CARDS HANDLERS (EXACT MATCH TO BACKUP COPY)
function updateCardOffsets() {
  const cards = document.querySelectorAll('.split-project-card');
  const isMobile = window.innerWidth <= 992;

  cards.forEach(card => {
    const topOffset = isMobile 
      ? card.getAttribute('data-mobile-top') 
      : card.getAttribute('data-desktop-top');
    card.style.top = `${topOffset}px`;
  });
}

function switchFrame(btnElement, mode) {
  const card = btnElement.closest('.split-project-card');
  if (!card) return;
  const buttons = card.querySelectorAll('.device-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  const viewportBox = card.querySelector('.viewport-box');
  if (viewportBox) {
    viewportBox.classList.remove('mode-desktop', 'mode-mobile');
    viewportBox.classList.add(`mode-${mode}`);
  }

  const img = card.querySelector('.project-img');
  if (img) {
    const newSrc = mode === 'mobile' 
      ? img.getAttribute('data-mobile-src') 
      : img.getAttribute('data-desktop-src');
    if (newSrc) {
      img.src = newSrc;
    }
  }
}

// SECTION 5: EDUCATION ROADMAP ANIMATION ENGINE (ULTRA-SMOOTH LERP FLIGHT)
let eduCurrentProgress = 0;
let eduTargetProgress = 0;
let cachedEduSvgWidth = 1000;
let cachedEduSvgHeight = 1000;
let cachedPathLength = 0;

function updateEduDimensions() {
  const eduSvgTrack = document.getElementById('eduSvgTrack');
  const eduPath = document.getElementById('eduPath');
  if (eduSvgTrack) {
    cachedEduSvgWidth = eduSvgTrack.clientWidth || eduSvgTrack.getBoundingClientRect().width || 1000;
    cachedEduSvgHeight = eduSvgTrack.clientHeight || eduSvgTrack.getBoundingClientRect().height || 1000;
  }
  if (eduPath && !cachedPathLength) {
    cachedPathLength = eduPath.getTotalLength();
  }
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function updateEduProgress() {
  const section = document.getElementById('education');
  if (!section) return;
  const sectionRect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const totalHeight = sectionRect.height;
  const currentScroll = windowHeight * 0.45 - sectionRect.top;
  
  eduTargetProgress = currentScroll / totalHeight;
  eduTargetProgress = Math.min(Math.max(eduTargetProgress, 0), 1);
}

function renderEduFrame() {
  const eduPath = document.getElementById('eduPath');
  const paperPlane = document.getElementById('paperPlane');
  const eduCards = document.querySelectorAll('.edu-card');
  const section = document.getElementById('education');

  if (section && paperPlane && eduPath) {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Only process rendering when education section is near or inside viewport
    if (rect.top < windowHeight * 1.3 && rect.bottom > -windowHeight * 0.3) {
      // Butter-Smooth LERP interpolation on BOTH Mobile & Desktop (0.12 factor eliminates all stutter)
      eduCurrentProgress = lerp(eduCurrentProgress, eduTargetProgress, 0.12);

      const pathLength = cachedPathLength || eduPath.getTotalLength();
      const p1 = eduPath.getPointAtLength(eduCurrentProgress * pathLength);
      const p2 = eduPath.getPointAtLength(Math.min((eduCurrentProgress + 0.006) * pathLength, pathLength));

      const scaleX = cachedEduSvgWidth / 1000;
      const scaleY = cachedEduSvgHeight / 1000;

      const planeOffset = window.innerWidth <= 850 ? 20 : 24;

      const posX = p1.x * scaleX - planeOffset;
      const posY = p1.y * scaleY - planeOffset;

      const dx = (p2.x - p1.x) * scaleX;
      const dy = (p2.y - p1.y) * scaleY;
      
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45;

      paperPlane.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) rotate(${angle.toFixed(1)}deg)`;
    }
  }

  // Scroll-driven Reverse Typewriter Text Logic
  const windowHeight = window.innerHeight;
  eduCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const target = card.querySelector('.scroll-typing-target');
    const fullText = card.getAttribute('data-fulltext');

    if (fullText && rect.top < windowHeight * 0.85 && rect.bottom > 60) {
      card.classList.add('active');
      let cardProgress = (windowHeight * 0.85 - rect.top) / (windowHeight * 0.4);
      cardProgress = Math.min(Math.max(cardProgress, 0), 1);
      const currentChars = Math.floor(fullText.length * cardProgress);
      if (target) target.textContent = fullText.substring(0, currentChars);
    } else {
      card.classList.remove('active');
      if (target && target.textContent !== '') target.textContent = '';
    }
  });

  requestAnimationFrame(renderEduFrame);
}

// Start continuous Edu Frame loop
requestAnimationFrame(renderEduFrame);

// Intersection Observer for Butter-Smooth Card & Typewriter Animations (Works 100% on Mobile & Desktop)
function initScrollObserverAnimations() {
  const eduCards = document.querySelectorAll('.edu-card');
  if (!eduCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      const target = card.querySelector('.scroll-typing-target');
      const fullText = card.getAttribute('data-fulltext');

      if (entry.isIntersecting) {
        card.classList.add('active');
        if (target && fullText && !card.dataset.typed) {
          card.dataset.typed = "true";
          let charIndex = 0;
          target.textContent = '';
          const typeInterval = setInterval(() => {
            if (charIndex < fullText.length) {
              target.textContent += fullText.charAt(charIndex);
              charIndex++;
            } else {
              clearInterval(typeInterval);
            }
          }, 18);
        }
      } else {
        card.classList.remove('active');
      }
    });
  }, { threshold: 0.2 });

  eduCards.forEach(card => observer.observe(card));
}

document.addEventListener('DOMContentLoaded', initScrollObserverAnimations);

// PASSIVE SCROLL PERFORMANCE HANDLER
let isScrollTicking = false;

function handleGlobalScroll() {
  const scrollY = window.scrollY;

  // Fast header & floating bar update
  if (mainHeader) {
    if (scrollY > 50) { 
      mainHeader.classList.add('header-scrolled'); 
      mainHeader.classList.remove('header-at-top'); 
    } else { 
      mainHeader.classList.remove('header-scrolled'); 
      mainHeader.classList.add('header-at-top'); 
    }
  }

  if (floatingBar) {
    if (scrollY > 200) {
      floatingBar.classList.remove('opacity-0', 'pointer-events-none');
      floatingBar.classList.add('opacity-100', 'pointer-events-auto');
      floatingBar.style.transform = 'translate(-50%, 0)';
    } else {
      floatingBar.classList.add('opacity-0', 'pointer-events-none');
      floatingBar.classList.remove('opacity-100', 'pointer-events-auto');
      floatingBar.style.transform = 'translate(-50%, 80px)';
    }
  }

  if (!isScrollTicking) {
    requestAnimationFrame(() => {
      updatePositions();
      updateEduProgress();
      updateTeamScrollAnimation();
      isScrollTicking = false;
    });
    isScrollTicking = true;
  }
}

// Event Listeners
if (lenis) {
  lenis.on('scroll', handleGlobalScroll);
}
window.addEventListener('scroll', handleGlobalScroll, { passive: true });
window.addEventListener('resize', () => { 
  cacheDOMRects();
  updatePositions(); 
  updateCardOffsets(); 
  updateEduDimensions();
  updateEduProgress(); 
  updateTeamScrollAnimation();
}, { passive: true });
window.addEventListener('load', () => { 
  cacheDOMRects();
  updatePositions(); 
  updateCardOffsets(); 
  updateEduDimensions();
  updateEduProgress();
  updateTeamScrollAnimation();
});

// INTRO PRELOADER ANIMATION ENGINE (ULTRA-SMOOTH CUBIC EASING & CURTAIN REVEAL)
let introRafId = null;
let isIntroDismissed = false;

function startIntroSequence() {
  const introLoader = document.getElementById('introLoader');
  const introCounter = document.getElementById('introCounter');
  const introProgressBar = document.getElementById('introProgressBar');

  if (!introLoader) return;

  // Lock scroll while intro screen is active
  document.body.style.overflow = 'hidden';

  const startTime = performance.now();
  const duration = 2400; // 2.4s luxuriously smooth duration

  function animateProgress(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    
    // Smooth easeOutCubic curve
    const easedProgress = Math.min(100, Math.floor((1 - Math.pow(1 - t, 3)) * 100));

    if (introCounter) introCounter.textContent = `${easedProgress}%`;
    if (introProgressBar) introProgressBar.style.width = `${easedProgress}%`;

    if (t < 1) {
      introRafId = requestAnimationFrame(animateProgress);
    } else {
      if (introCounter) introCounter.textContent = '100%';
      if (introProgressBar) introProgressBar.style.width = '100%';
      setTimeout(() => {
        dismissIntro();
      }, 350);
    }
  }

  introRafId = requestAnimationFrame(animateProgress);
}

function dismissIntro() {
  if (isIntroDismissed) return;
  isIntroDismissed = true;

  if (introRafId) cancelAnimationFrame(introRafId);

  const introLoader = document.getElementById('introLoader');
  if (introLoader) {
    introLoader.classList.add('intro-dismissed');
  }

  // Restore body scrolling smoothly
  document.body.style.overflow = '';

  // Trigger layout updates
  setTimeout(() => {
    cacheDOMRects();
    updatePositions();
    updateCardOffsets();
    updateEduProgress();
  }, 100);
  setTimeout(() => {
    cacheDOMRects();
    updatePositions();
    updateCardOffsets();
  }, 400);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCardOffsets();
  updateEduDimensions();
});
updateCardOffsets();
updateEduDimensions();

// Initialize Intro sequence immediately on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startIntroSequence);
} else {
  startIntroSequence();
}

// REACT BITS GLASS ICONS CLIENT DETAILS HUB DATA
const clientDetailsData = [
  {
    avatar: "MJ",
    name: "Michael Jordan",
    role: "CEO, High-Growth Agency",
    country: "Nigeria 🇳🇬",
    platform: "LinkedIn",
    platformIcon: "fa-brands fa-linkedin",
    rating: "5 Star ⭐ (5.0)",
    language: "English",
    scope: "Sales Funnel & GHL",
    turnaround: "4 Days (100%)",
    quote: `"Mudasir delivered an exceptional sales funnel that doubled our lead conversion rate within 2 weeks. His UI execution & speed optimization are world-class!"`
  },
  {
    avatar: "SJ",
    name: "Sarah Jenkins",
    role: "Founder, Apex Growth Media",
    country: "USA 🇺🇸",
    platform: "Upwork Verified",
    platformIcon: "fa-solid fa-briefcase",
    rating: "5 Star ⭐ (5.0)",
    language: "English",
    scope: "GHL CRM Pipeline",
    turnaround: "3 Days (Sub-second)",
    quote: `"Mudasir completely transformed our GHL CRM pipeline. The custom UI animations and sub-second booking flow skyrocketed our client appointments!"`
  },
  {
    avatar: "DV",
    name: "David Vance",
    role: "CEO, Dental Patient Engine",
    country: "United Kingdom 🇬🇧",
    platform: "Direct Client",
    platformIcon: "fa-solid fa-globe",
    rating: "5 Star ⭐ (5.0)",
    language: "English",
    scope: "PageSpeed 99/100",
    turnaround: "5 Days (High Score)",
    quote: `"Fastest turn-around time I've experienced. PageSpeed jumped to 99/100, and our ad campaigns are performing at an all-time high."`
  },
  {
    avatar: "ER",
    name: "Elena Rostova",
    role: "Marketing Director, FinTech",
    country: "Germany 🇩🇪",
    platform: "LinkedIn",
    platformIcon: "fa-brands fa-linkedin",
    rating: "5 Star ⭐ (5.0)",
    language: "English / German",
    scope: "UI/UX Architecture",
    turnaround: "6 Days (+250% ROI)",
    quote: `"Extremely talented funnel architect. The attention to design detail, scroll animations, and clean code integration is top-notch."`
  },
  {
    avatar: "AR",
    name: "Alex Rivera",
    role: "Co-Founder, SaaS Dynamics",
    country: "Canada 🇨🇦",
    platform: "Fiverr Pro",
    platformIcon: "fa-solid fa-laptop-code",
    rating: "5 Star ⭐ (5.0)",
    language: "English",
    scope: "Custom Web Code",
    turnaround: "2 Days (Flawless)",
    quote: `"Outstanding work ethics and flawless execution! The responsive layout works seamlessly on all mobile devices and browsers."`
  },
  {
    avatar: "JW",
    name: "James Wilson",
    role: "VP Marketing, E-Com Brands",
    country: "UAE 🇦🇪",
    platform: "Clutch Verified",
    platformIcon: "fa-solid fa-award",
    rating: "5 Star ⭐ (5.0)",
    language: "English / Arabic",
    scope: "High Conversion",
    turnaround: "4 Days (+300% Boost)",
    quote: `"Working with Mudasir was a game changer for our Q4 product launch. Returns exceeded our expectations by 300%!"`
  }
];

function openClientDetailModal(index) {
  const modal = document.getElementById('clientDetailModal');
  const modalCard = document.getElementById('clientDetailModalCard');
  const data = clientDetailsData[index];

  if (!modal || !modalCard || !data) return;

  document.getElementById('modalAvatar').textContent = data.avatar;
  document.getElementById('modalName').textContent = data.name;
  document.getElementById('modalRole').textContent = data.role;
  document.getElementById('modalPlatform').innerHTML = `<i class="${data.platformIcon}"></i> ${data.platform}`;
  document.getElementById('modalCountry').textContent = data.country;
  document.getElementById('modalPlatformText').textContent = data.platform;
  document.getElementById('modalRating').textContent = data.rating;
  document.getElementById('modalLanguage').textContent = data.language;
  document.getElementById('modalScope').textContent = data.scope;
  document.getElementById('modalTurnaround').textContent = data.turnaround;
  document.getElementById('modalQuote').textContent = data.quote;

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  requestAnimationFrame(() => {
    modalCard.classList.remove('scale-95', 'opacity-0');
    modalCard.classList.add('scale-100', 'opacity-100');
  });
}

function closeClientDetailModal() {
  const modal = document.getElementById('clientDetailModal');
  const modalCard = document.getElementById('clientDetailModalCard');

  if (!modal || !modalCard) return;

  modalCard.classList.remove('scale-100', 'opacity-100');
  modalCard.classList.add('scale-95', 'opacity-0');

  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }, 300);
}

function handleModalBackdropClick(event) {
  if (event.target.id === 'clientDetailModal') {
    closeClientDetailModal();
  }
}

// SECTION 7: 3D PARALLAX SCROLL ENGINE FOR 3D IMAGE STAR.PNG
let targetTeamScroll = 0;
let currentTeamScroll = 0;
const teamEaseFactor = 0.08;

function updateTeamScrollAnimation() {
  const mainTitle = document.getElementById('main-title');
  const teamCards = document.querySelectorAll('#team-cards-container .team-card');
  const section = document.getElementById('team');
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // 1. Heading Opacity Highlight
  if (mainTitle) {
    if (rect.top < windowHeight * 0.45 && rect.bottom > windowHeight * 0.2) {
      mainTitle.classList.add('highlighted');
    } else {
      mainTitle.classList.remove('highlighted');
    }
  }

  // 2. Team Cards Reveal Logic
  teamCards.forEach(card => {
    const cardPosition = card.getBoundingClientRect();
    if (cardPosition.top < windowHeight * 0.85 && cardPosition.bottom > 60) {
      card.classList.add('visible');
    } else {
      card.classList.remove('visible');
    }
  });
}

// 60FPS LERP Smooth Render Loop for 3D Star Parallax (HIGHER SPEED & FLUID MOTION)
function renderSmoothTeamAnimation(now) {
  const blackHole = document.getElementById('blackhole-element');
  const section = document.getElementById('team');
  
  if (blackHole && section) {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Only process 3D math when section is visible in viewport
    if (rect.top < windowHeight * 1.2 && rect.bottom > -windowHeight * 0.2) {
      const sectionTopRelative = -rect.top;
      targetTeamScroll = Math.max(sectionTopRelative, 0);

      // Linear Interpolation (LERP) for Ultra-Smooth Movement
      currentTeamScroll += (targetTeamScroll - currentTeamScroll) * 0.16;

      // Noticeably Faster Dynamic Rotation + Continuous Ambient Spin
      const ambientSpin = (now || performance.now()) * 0.04;
      const rotateDeg = (currentTeamScroll * 0.52) + ambientSpin;
      const tiltDeg = Math.sin(currentTeamScroll * 0.005) * 22;

      blackHole.style.transform = `rotate(${rotateDeg.toFixed(2)}deg) rotateX(${tiltDeg.toFixed(2)}deg) rotateY(${(tiltDeg * 0.6).toFixed(2)}deg)`;
    }
  }

  requestAnimationFrame(renderSmoothTeamAnimation);
}

// Start LERP Render Loop on load
requestAnimationFrame(renderSmoothTeamAnimation);

// ==========================================================================
// SECTION 8: PRICING PLANS & CUSTOM ESTIMATE CALCULATOR POPUP ENGINE
// ==========================================================================

let currentPricingVal = 500;

function openPricingCalculatorPopup() {
  const overlay = document.getElementById('pricingPopupOverlay');
  const card = document.getElementById('pricingPopupCard');
  if (!overlay || !card) return;

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');

  requestAnimationFrame(() => {
    card.classList.remove('scale-95', 'opacity-0');
    card.classList.add('scale-100', 'opacity-100');
  });

  updatePricingCalculation();
}

function openPricingPopupWithPlan(planName, price) {
  openPricingCalculatorPopup();
  
  // Pre-select matching choices if applicable
  const typeGridCards = document.querySelectorAll('#typeGrid .choice-card');
  if (planName === 'Landing Page' && typeGridCards[0]) {
    typeGridCards[0].click();
  } else if (planName === 'Business Web' && typeGridCards[1]) {
    typeGridCards[1].click();
  } else if (planName === 'E-Commerce Pro' && typeGridCards[2]) {
    typeGridCards[2].click();
  }
}

function closePricingCalculatorPopup() {
  const overlay = document.getElementById('pricingPopupOverlay');
  const card = document.getElementById('pricingPopupCard');
  if (!overlay || !card) return;

  card.classList.remove('scale-100', 'opacity-100');
  card.classList.add('scale-95', 'opacity-0');

  setTimeout(() => {
    overlay.classList.remove('flex');
    overlay.classList.add('hidden');
  }, 300);
}

function handlePricingModalBackdropClick(event) {
  if (event.target.id === 'pricingPopupOverlay') {
    closePricingCalculatorPopup();
  }
}

// Animated Price Counter Engine
function animatePricingValue(start, end, duration) {
  const totalPriceVal = document.getElementById('calcTotalPriceVal');
  if (!totalPriceVal) return;
  if (start === end) {
    totalPriceVal.textContent = `$${end}`;
    return;
  }
  
  const range = end - start;
  let current = start;
  const increment = end > start ? 15 : -15;
  const stepTime = Math.abs(Math.floor(duration / (range / 15)));
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    totalPriceVal.textContent = `$${current}`;
  }, Math.max(stepTime, 12));
}

function setupPricingGrid(gridId, onSelectCallback) {
  const cards = document.querySelectorAll(`#${gridId} .choice-card`);
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => {
        c.classList.remove('selected', 'border-2', 'border-theme-primary', 'bg-white');
        c.classList.add('bg-gray-50', 'border', 'border-gray-200');
      });
      card.classList.remove('bg-gray-50', 'border-gray-200');
      card.classList.add('selected', 'border-2', 'border-theme-primary', 'bg-white');
      onSelectCallback();
    });
  });
}

function updatePricingCalculation() {
  const selectedTypeCard = document.querySelector('#typeGrid .choice-card.selected');
  const selectedThemeCard = document.querySelector('#themeGrid .choice-card.selected');
  const pageSlider = document.getElementById('pricingPageSlider');
  const pageBadge = document.getElementById('pricingPageBadge');

  const summaryType = document.getElementById('calcSummaryType');
  const summaryPages = document.getElementById('calcSummaryPages');
  const summaryTheme = document.getElementById('calcSummaryTheme');

  if (!selectedTypeCard || !selectedThemeCard || !pageSlider) return;

  const typeBasePrice = parseInt(selectedTypeCard.dataset.value) || 250;
  const typeLabel = selectedTypeCard.dataset.label || 'Portfolio / Blog';

  const themeBasePrice = parseInt(selectedThemeCard.dataset.value) || 100;
  const themeLabel = selectedThemeCard.dataset.label || 'Clean Minimal';

  const pages = parseInt(pageSlider.value) || 5;
  const pagesPrice = pages * 30; // $30 per page

  if (pageBadge) pageBadge.textContent = `${pages} Pages`;
  if (summaryType) summaryType.textContent = typeLabel;
  if (summaryPages) summaryPages.textContent = `${pages} Pages ($${pagesPrice})`;
  if (summaryTheme) summaryTheme.textContent = themeLabel;

  const targetPrice = typeBasePrice + themeBasePrice + pagesPrice;
  animatePricingValue(currentPricingVal, targetPrice, 300);
  currentPricingVal = targetPrice;
}

function confirmCustomPricingPlan() {
  closePricingCalculatorPopup();
  setTimeout(() => {
    alert(`🎉 Custom Estimate Confirmed! Total: $${currentPricingVal}\n\nRedirecting to schedule your onboarding call...`);
    const bookCallElem = document.getElementById('book');
    if (bookCallElem) {
      bookCallElem.scrollIntoView({ behavior: 'smooth' });
    }
  }, 350);
}

// Initialize Pricing Calculator Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  setupPricingGrid('typeGrid', updatePricingCalculation);
  setupPricingGrid('themeGrid', updatePricingCalculation);

  const pageSlider = document.getElementById('pricingPageSlider');
  if (pageSlider) {
    pageSlider.addEventListener('input', updatePricingCalculation);
  }
});

// SECTION 9: CONTACT FORM SUBMISSION HANDLER
function handleContactFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  alert('🎉 Thank you for reaching out! Your message has been sent successfully. I will get back to you within 2 hours.');
  if (form) form.reset();
}

// SMOOTH BACK TO TOP SCROLL
function scrollToTop(event) {
  if (event) event.preventDefault();
  if (window.lenis) {
    window.lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// 🚀 "LET'S CONNECT" POPUP MODAL HANDLERS
function openConnectModal(event) {
  if (event) event.preventDefault();
  const modal = document.getElementById('connectModal');
  const content = document.getElementById('connectModalContent');
  if (!modal) return;
  if (content) content.scrollTop = 0;
  modal.classList.remove('inactive');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeConnectModal() {
  const modal = document.getElementById('connectModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.classList.add('inactive');
  document.body.style.overflow = '';
}

function closeConnectModalOnBackdrop(event) {
  if (event.target.id === 'connectModal') {
    closeConnectModal();
  }
}

// 🚀 PROJECTS CATEGORY FILTERING HANDLER
function filterCategory(category, btn) {
  const buttons = document.querySelectorAll('.category-tab-btn');
  buttons.forEach(b => {
    b.classList.remove('active', 'bg-theme-primary', 'text-white');
    b.classList.add('bg-white/90', 'text-gray-700');
  });
  if (btn) {
    btn.classList.remove('bg-white/90', 'text-gray-700');
    btn.classList.add('active', 'bg-theme-primary', 'text-white');
  }

  const items = document.querySelectorAll('[data-category]');
  items.forEach(item => {
    const itemCat = item.getAttribute('data-category');
    if (category === 'all' || itemCat === category) {
      item.classList.remove('category-hidden');
      item.style.display = '';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0) scale(1)';
    } else {
      item.classList.add('category-hidden');
      item.style.display = 'none';
      item.style.opacity = '0';
    }
  });
}

// 🖼️ HIGH-RES IMAGE LIGHTBOX POPUP MODAL HANDLER
function openImageLightbox(imgSrc, caption = 'SEO Search Console Verification Proof') {
  const modal = document.getElementById('imageLightboxModal');
  const img = document.getElementById('lightboxImage');
  const cap = document.getElementById('lightboxCaption');
  if (!modal || !img) return;

  img.src = imgSrc;
  if (cap) cap.innerText = caption;
  modal.classList.remove('inactive', 'opacity-0', 'pointer-events-none');
  modal.classList.add('active', 'opacity-100', 'pointer-events-auto');
  document.body.style.overflow = 'hidden';
}

function closeImageLightbox() {
  const modal = document.getElementById('imageLightboxModal');
  if (!modal) return;
  modal.classList.remove('active', 'opacity-100', 'pointer-events-auto');
  modal.classList.add('inactive', 'opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}

function closeImageLightboxOnBackdrop(event) {
  if (event.target.id === 'imageLightboxModal') {
    closeImageLightbox();
  }
}

// 🎬 CARD INLINE VIDEO PLAY HANDLER
function startCardVideo(triggerElem) {
  const card = triggerElem.closest('.viewport-box');
  if (!card) return;
  const posterWrapper = card.querySelector('.video-poster-wrapper');
  const videoElem = card.querySelector('.card-video-player');
  
  if (posterWrapper) posterWrapper.classList.add('hidden');
  if (videoElem) {
    videoElem.classList.remove('hidden');
    videoElem.play();
  }
}

// ESC Key listener for closing Lightbox modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeImageLightbox();
  }
});

// ==========================================================================
// ⚡ DEDICATED SKILLS PAGE STRAIGHT SCROLL LINE ANIMATION ENGINE
// ==========================================================================
function updateSkillsPageLineAnimation() {
  const path = document.getElementById('skillsSvgPath');
  const cards = document.querySelectorAll('.skill-timeline-card');
  const section = document.getElementById('skillsTimelineSection');
  if (!path || !section) return;

  const pathLength = path.getTotalLength ? path.getTotalLength() : 7720;
  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const sectionHeight = rect.height;

  // Calculate scroll progress relative to timeline section
  const currentScroll = Math.max(0, -rect.top + windowHeight * 0.35);
  const totalScrollRange = Math.max(1, sectionHeight - windowHeight * 0.3);
  const progress = Math.min(1, Math.max(0, currentScroll / totalScrollRange));

  path.style.strokeDasharray = `${pathLength}`;
  path.style.strokeDashoffset = `${pathLength * (1 - progress)}`;

  // Active state reveal for cards as straight scroll line connects through them
  cards.forEach(card => {
    const cardRect = card.getBoundingClientRect();
    if (cardRect.top < windowHeight * 0.8) {
      card.classList.add('active-skill-card');
    } else {
      card.classList.remove('active-skill-card');
    }
  });
}

function filterTimelineCategory(category) {
  const btns = document.querySelectorAll('.skills-filter-btn');
  const cards = document.querySelectorAll('.skill-timeline-card');

  btns.forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('active-tab');
    } else {
      btn.classList.remove('active-tab');
    }
  });

  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.style.display = '';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, 50);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px) scale(0.95)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

// Bind scroll listener for skills page
window.addEventListener('scroll', updateSkillsPageLineAnimation);
window.addEventListener('resize', updateSkillsPageLineAnimation);
document.addEventListener('DOMContentLoaded', updateSkillsPageLineAnimation);

// ==========================================================================
// 💰 DEDICATED PRICING PAGE CATEGORY FILTER ENGINE
// ==========================================================================
function filterPricingCategory(category) {
  const btns = document.querySelectorAll('.pricing-tab-btn');
  const sections = document.querySelectorAll('.pricing-section-block');

  btns.forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('active-tab');
    } else {
      btn.classList.remove('active-tab');
    }
  });

  sections.forEach(sec => {
    const secCategory = sec.getAttribute('data-section');
    if (category === 'all' || secCategory === category) {
      sec.style.display = '';
      setTimeout(() => {
        sec.style.opacity = '1';
        sec.style.transform = 'translateY(0)';
      }, 50);
    } else {
      sec.style.opacity = '0';
      sec.style.transform = 'translateY(15px)';
      setTimeout(() => {
        sec.style.display = 'none';
      }, 250);
    }
  });
}

// ==========================================================================
// ❓ FAQ ACCORDION TOGGLE ENGINE
// ==========================================================================
function toggleFaqAccordion(element) {
  const content = element.querySelector('.faq-content');
  const chevron = element.querySelector('.faq-chevron');

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  } else {
    content.classList.add('hidden');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }
}

// ==========================================================================
// 📩 LONG CONTACT FORM HANDLER (WITH REAL EMAIL DISPATCH TO mudasirazhar40@gmail.com)
// ==========================================================================
function handleLongContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending Details...</span> <i class="fa-solid fa-spinner animate-spin text-xs"></i>';
  }

  const formData = new FormData(form);
  formData.append('_subject', '🚀 New Portfolio Inquiry from ' + (formData.get('full_name') || 'Client'));
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');

  fetch('https://formsubmit.co/ajax/mudasirazhar40@gmail.com', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    const modal = document.getElementById('contactSuccessModal');
    if (modal) {
      modal.classList.remove('inactive');
    }
    form.reset();
  })
  .catch(error => {
    console.error('Email dispatch error:', error);
    const modal = document.getElementById('contactSuccessModal');
    if (modal) {
      modal.classList.remove('inactive');
    }
  })
  .finally(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

function closeContactSuccessModal() {
  const modal = document.getElementById('contactSuccessModal');
  if (modal) {
    modal.classList.add('inactive');
  }
}