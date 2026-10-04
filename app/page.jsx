  'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';

const PLAYLIST = [
  {
    title: 'Always — Daniel Caesar',
    src: encodeURI('/Daniel Caesar - Always (Lyrics).mp3'),
  },
  {
    title: 'Aku Milikmu — Dewa 19',
    src: encodeURI('/Aku Milikmu - Dewa 19 (Lyrics Video).mp3'),
  },
  {
    title: 'Kangen — Dewa 19',
    src: encodeURI('/Dewa 19 - Kangen (Official Audio).mp3'),
  },
];

const GALLERY_ITEMS = [
  {
    src: '/momnt1.jpeg',
    plate: 'MOMENT 01',
    meta: 'SWEET MEMORY · 01',
    title: 'The Smile That Stole My Heart',
    excerpt: '"If there is one thing in this world I never get tired of looking at, it is your smile. Simple, gentle, yet it always melts my heart in a heartbeat."',
    caption: 'Your sweet smile that always has its own way of brightening my day and making me fall in love all over again.',
  },
  {
    src: '/moment2.jpeg',
    plate: 'MOMENT 02',
    meta: 'SWEET MEMORY · 02',
    title: 'Lost in Our Laughter & Stories',
    excerpt: '"Moments where time seems to stand still whenever we are together. No matter how exhausting the world gets, talking to you is always my favorite cure."',
    caption: 'Every second of our late-night talks, effortless laughter, and shared moments that I cherish every single day.',
  },
  {
    src: '/momnt3.jpeg',
    plate: 'MOMENT 03',
    meta: 'SWEET MEMORY · 03',
    title: 'The Journey We Walk Together',
    excerpt: '"Thank you for always being by my side, walking gently with me without ever rushing. Holding your hand is the safest feeling in the universe."',
    caption: 'Walking side by side with you, embracing each new day with boundless gratitude in my heart.',
  },
  {
    src: '/moment4.jpeg',
    plate: 'MOMENT 04',
    meta: 'SWEET MEMORY · 04',
    title: 'Where My Heart Calls Home',
    excerpt: '"In whatever corner of the earth I wander, my heart will always find its way back to you. You are the warmest home I have ever known."',
    caption: 'A tender promise to always cherish, protect, and stand beside you forever and always.',
  },
];

const DEFAULT_WISHES = [
  {
    id: 1,
    author: 'Raden ❤️',
    time: 'Oct 14, 2024',
    message:
      'Happy birthday to my favorite person in the world, Felisha! Thank you for coming into my life and completing it in such a breathtaking way. May you always be radiantly happy, healthy, and blessed, and may we celebrate every single birthday together. I love you so much!',
    amens: 14,
  },
  {
    id: 2,
    author: 'Friends & Family',
    time: 'Oct 14, 2024',
    message:
      'Happy Birthday beautiful Felisha! Wishing you a wonderful year ahead, full of good health, joy, and that all your sweetest dreams come true!',
    amens: 9,
  },
];

// Helper to trigger romantic gold & rose confetti
const triggerRomanticSparks = (origin = { x: 0.5, y: 0.5 }) => {
  if (typeof window === 'undefined') return;
  import('canvas-confetti').then((module) => {
    const confetti = module.default;
    confetti({
      particleCount: 55,
      spread: 80,
      origin,
      colors: ['#e63946', '#dfba73', '#ff758f', '#fae8ba', '#ffb3c1', '#ffffff'],
      ticks: 220,
      gravity: 0.7,
      scalar: 0.95,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true,
    });
  });
};

export default function Home() {
  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Preloader State
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPreloaderEntered, setIsPreloaderEntered] = useState(false);
  const [isPreloaderUnmounted, setIsPreloaderUnmounted] = useState(false);

  // Audio State & Progress Scrubber
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // 3D Tilt for Portrait
  const [portraitTilt, setPortraitTilt] = useState({ x: 0, y: 0 });

  // Envelope State
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const letterRef = useRef(null);

  // Candle State
  const [isExtinguished, setIsExtinguished] = useState(false);
  const [showWishReveal, setShowWishReveal] = useState(false);

  // Lightbox State
  const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 });

  // Wishboard State
  const [wishes, setWishes] = useState(DEFAULT_WISHES);
  const [wishAuthor, setWishAuthor] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [userAmens, setUserAmens] = useState({});

  // Active Nav Section
  const [activeSection, setActiveSection] = useState('hero');

  // Mobile Navigation & Audio Dock Controls
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAudioDockMinimized, setIsAudioDockMinimized] = useState(false);

  // Ambient Particles Canvas Ref
  const canvasRef = useRef(null);

  // Smooth Preloader Progress Animation
  useEffect(() => {
    let startTimestamp = null;
    const duration = 2400; // 2.4 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setLoadProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Enter Gala / Open Birthday Gift Handler
  const handleEnterGala = () => {
    if (isPreloaderEntered) return;
    triggerRomanticSparks({ x: 0.5, y: 0.5 });

    // Start music smoothly
    if (audioRef.current) {
      if (!audioRef.current.src || audioRef.current.src === '' || audioRef.current.src === window.location.href) {
        audioRef.current.src = PLAYLIST[0].src;
        audioRef.current.load();
      }
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        promise.then(() => setIsPlaying(true)).catch((err) => console.warn('Autoplay prevented:', err));
      }
    }

    setIsPreloaderEntered(true);
    setTimeout(() => {
      setIsPreloaderUnmounted(true);
    }, 1250);
  };

  // Ambient Floating Warm Rose & Gold Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.15,
      alpha: Math.random() * 0.5 + 0.25,
      pulse: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.4 ? 'rgba(223, 186, 115,' : 'rgba(232, 96, 122,',
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.005;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${Math.max(0.12, Math.min(0.75, p.alpha))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(223, 186, 115, 0.4)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Load stored wishes on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('felisha_romantic_birthday_wishes_v1');
      if (saved) {
        setWishes(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === 'Escape') {
        setLightbox({ isOpen: false, index: 0 });
      } else if (e.key === 'ArrowRight') {
        setLightbox((prev) => ({
          ...prev,
          index: (prev.index + 1) % GALLERY_ITEMS.length,
        }));
      } else if (e.key === 'ArrowLeft') {
        setLightbox((prev) => ({
          ...prev,
          index: (prev.index - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length,
        }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen]);

  // Initialize audio volume and first track on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.85;
      audioRef.current.src = PLAYLIST[0].src;
      audioRef.current.load();
    }
  }, []);

  // Audio time update & metadata handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const playTrack = (index, shouldPlay = true) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextIdx = (index + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTime(0);

    const targetSrc = PLAYLIST[nextIdx].src;
    audio.pause();
    audio.src = targetSrc;
    audio.load();

    if (shouldPlay) {
      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Playback delayed or interrupted:', err);
            const onCanPlay = () => {
              audio.play().then(() => setIsPlaying(true)).catch(() => {});
              audio.removeEventListener('canplay', onCanPlay);
            };
            audio.addEventListener('canplay', onCanPlay, { once: true });
          });
      }
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src || audio.src === '' || audio.src === window.location.href) {
        audio.src = PLAYLIST[currentTrackIndex].src;
        audio.load();
      }
      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Play prevented:', err);
            setIsPlaying(false);
          });
      }
    }
  };

  const nextTrack = () => {
    playTrack(currentTrackIndex + 1, true);
  };

  const prevTrack = () => {
    playTrack(currentTrackIndex - 1, true);
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 3D Portrait Tilt calculation
  const handlePortraitMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPortraitTilt({
      x: -y / 22,
      y: x / 22,
    });
  };

  const handlePortraitLeave = () => {
    setPortraitTilt({ x: 0, y: 0 });
  };

  // Envelope Controls with Sparks
  const handleOpenEnvelope = (e) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;
      triggerRomanticSparks({ x: originX, y: originY });
    } else {
      triggerRomanticSparks({ x: 0.5, y: 0.5 });
    }

    setIsEnvelopeOpen(true);
    setTimeout(() => {
      if (letterRef.current) {
        const rect = letterRef.current.getBoundingClientRect();
        if (rect.top < 100 || rect.top > 350) {
          window.scrollBy({
            top: rect.top - 120,
            behavior: 'smooth',
          });
        }
      }
    }, 650);
  };

  const handleCloseEnvelope = () => {
    setIsEnvelopeOpen(false);
    const container = document.getElementById('envelope-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleHeroLetterClick = (e) => {
    e.preventDefault();
    const target = document.getElementById('letter');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => handleOpenEnvelope(null), 550);
    }
  };

  // Candle Controls with Stardust
  const handleExtinguishCandle = (e) => {
    if (isExtinguished) return;
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;
      triggerRomanticSparks({ x: originX, y: originY });
    }
    setIsExtinguished(true);
    setTimeout(() => {
      setShowWishReveal(true);
    }, 700);
  };

  const handleReigniteCandle = () => {
    setIsExtinguished(false);
    setShowWishReveal(false);
  };

  // Wishboard Submit
  const handleWishSubmit = (e) => {
    e.preventDefault();
    if (!wishAuthor.trim() || !wishMessage.trim()) return;

    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeStr = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    const newWish = {
      id: Date.now(),
      author: wishAuthor.trim(),
      time: timeStr,
      message: wishMessage.trim(),
      amens: 1,
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('felisha_romantic_birthday_wishes_v1', JSON.stringify(updated));
    } catch {}

    triggerRomanticSparks({ x: 0.5, y: 0.7 });
    setWishAuthor('');
    setWishMessage('');
  };

  // Toggle Amen reaction
  const handleAmen = (id) => {
    if (userAmens[id]) return;
    setUserAmens((prev) => ({ ...prev, [id]: true }));
    setWishes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amens: (item.amens || 0) + 1 } : item))
    );
  };

  return (
    <>
      {/* ─── HAUTE GOLD SCROLL PROGRESS BAR ─── */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      {/* ─── AMBIENT PARTICLES CANVAS ─── */}
      <canvas id="ambient-particles-canvas" ref={canvasRef} />

      {/* ─── FILM GRAIN & AMBIENT ATMOSPHERE ─── */}
      <div className="film-grain" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />

      {/* ─── CINEMATIC ROMANTIC PRELOADER ─── */}
      {!isPreloaderUnmounted && (
        <div
          className={`cinematic-preloader ${isPreloaderEntered ? 'is-entered' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Birthday Gift Loading"
        >
          {/* Dual Theatrical Shutters */}
          <div className="preloader-shutter-top" />
          <div className="preloader-shutter-bottom" />

          {/* Central Preloader Core */}
          <div className="preloader-content">
            {/* Concentric Rotating Orbit Rings & Heart Crest */}
            <div className="preloader-crest-wrapper">
              <div className="orbit-ring-outer" />
              <div className="orbit-ring-inner" />
              <div className="preloader-crest">🌹</div>
            </div>

            <span className="preloader-tag">A SPECIAL BIRTHDAY TRIBUTE</span>
            <h1 className="preloader-title">Felisha Oktarina</h1>
            <p className="preloader-date">14 · OCTOBER · OUR SPECIAL DAY</p>

            {/* Hairline Progress Track */}
            <div className="preloader-progress-track">
              <div
                className="preloader-progress-fill"
                style={{ width: `${loadProgress}%` }}
              />
            </div>

            {/* Progress Metadata & Romantic Status */}
            <div className="preloader-meta-row">
              <span className="preloader-status-text">
                {loadProgress < 30
                  ? 'Remembering your first smile...'
                  : loadProgress < 65
                  ? 'Gathering our most precious memories...'
                  : loadProgress < 100
                  ? 'Writing my deepest feelings for you...'
                  : 'Your birthday gift is ready.'}
              </span>
              <span className="preloader-percentage">{loadProgress}%</span>
            </div>

            {/* Entrance Button (Revealed at 100%) */}
            {loadProgress >= 100 && (
              <motion.button
                type="button"
                className="btn-enter-gala"
                onClick={handleEnterGala}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                autoFocus
              >
                <i className="fa-solid fa-gift" />
                <span>Open Your Birthday Gift</span>
                <i className="fa-solid fa-heart" style={{ color: '#e63946' }} />
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* ─── ROMANTIC NAVIGATION BAR ─── */}
      <nav className="nav-bar" id="navbar">
        <div className="nav-bar__inner">
          <a href="#hero" className="nav-brand">
            <span className="brand-crest">🌹</span>
            <span className="brand-name">
              FELISHA <em>14 · 10</em>
            </span>
          </a>
          <div className="nav-links">
            <a href="#hero" className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}>
              HOME
            </a>
            <span className="nav-sep">·</span>
            <a
              href="#gallery"
              className={`nav-link ${activeSection === 'gallery' ? 'active' : ''}`}
            >
              MEMORIES
            </a>
            <span className="nav-sep">·</span>
            <a href="#letter" className={`nav-link ${activeSection === 'letter' ? 'active' : ''}`}>
              LOVE LETTER
            </a>
            <span className="nav-sep">·</span>
            <a href="#candle" className={`nav-link ${activeSection === 'candle' ? 'active' : ''}`}>
              MAKE A WISH
            </a>
            <span className="nav-sep">·</span>
            <a href="#reflections" className={`nav-link ${activeSection === 'reflections' ? 'active' : ''}`}>
              ABOUT YOU
            </a>
            <span className="nav-sep">·</span>
            <a href="#wishes" className={`nav-link ${activeSection === 'wishes' ? 'active' : ''}`}>
              WISHES
            </a>
          </div>
          <div className="nav-actions">
            <button
              id="nav-sound-btn"
              className={`nav-sound-pill ${isPlaying ? 'is-playing' : ''}`}
              type="button"
              onClick={togglePlay}
              aria-label="Toggle Sound"
            >
              <span className="sound-bars" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="sound-label">{isPlaying ? 'Pause' : 'Music'}</span>
            </button>

            <button
              type="button"
              className={`nav-mobile-toggle ${isMobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Navigation"
              aria-expanded={isMobileMenuOpen}
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>

        {/* ─── LUXURY MOBILE NAVIGATION DRAWER ─── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="nav-mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-menu-header">
                <div className="mobile-menu-crest">🌹</div>
                <div className="mobile-menu-meta">
                  <span className="mobile-menu-title gold-gradient-text">Felisha's Birthday</span>
                  <span className="mobile-menu-date">14 · OCTOBER · WITH ALL MY LOVE</span>
                </div>
              </div>

              <div className="mobile-menu-links">
                <a
                  href="#hero"
                  className={`mobile-nav-item ${activeSection === 'hero' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mobile-item-icon">🌹</span>
                  <div className="mobile-item-text">
                    <span className="mobile-item-title">Home</span>
                    <span className="mobile-item-sub">Birthday Tribute</span>
                  </div>
                  <i className="fa-solid fa-chevron-right mobile-item-arrow" />
                </a>

                <a
                  href="#gallery"
                  className={`mobile-nav-item ${activeSection === 'gallery' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mobile-item-icon">📷</span>
                  <div className="mobile-item-text">
                    <span className="mobile-item-title">Memories</span>
                    <span className="mobile-item-sub">Our Sweetest Moments</span>
                  </div>
                  <i className="fa-solid fa-chevron-right mobile-item-arrow" />
                </a>

                <a
                  href="#letter"
                  className={`mobile-nav-item ${activeSection === 'letter' ? 'active' : ''}`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsEnvelopeOpen(true);
                  }}
                >
                  <span className="mobile-item-icon">💌</span>
                  <div className="mobile-item-text">
                    <span className="mobile-item-title">Love Letter</span>
                    <span className="mobile-item-sub">From the Heart of Raden</span>
                  </div>
                  <i className="fa-solid fa-chevron-right mobile-item-arrow" />
                </a>

                <a
                  href="#candle"
                  className={`mobile-nav-item ${activeSection === 'candle' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mobile-item-icon">🎂</span>
                  <div className="mobile-item-text">
                    <span className="mobile-item-title">Make a Wish</span>
                    <span className="mobile-item-sub">Blow Your Birthday Candle</span>
                  </div>
                  <i className="fa-solid fa-chevron-right mobile-item-arrow" />
                </a>

                <a
                  href="#reflections"
                  className={`mobile-nav-item ${activeSection === 'reflections' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mobile-item-icon">❤️</span>
                  <div className="mobile-item-text">
                    <span className="mobile-item-title">Why I Love You</span>
                    <span className="mobile-item-sub">Three Little Things</span>
                  </div>
                  <i className="fa-solid fa-chevron-right mobile-item-arrow" />
                </a>

                <a
                  href="#wishes"
                  className={`mobile-nav-item ${activeSection === 'wishes' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mobile-item-icon">✍️</span>
                  <div className="mobile-item-text">
                    <span className="mobile-item-title">Sweet Wishes</span>
                    <span className="mobile-item-sub">Guestbook & Blessings</span>
                  </div>
                  <i className="fa-solid fa-chevron-right mobile-item-arrow" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── MAIN CONTENT ─── */}
      <main>
        {/* ═════════════════════════════════════════════════════════════════
             SECTION I: THE ROMANTIC BIRTHDAY HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section className="section-hero" id="hero">
          <div className="hero-container">
            {/* Left: Romantic Gilded Frame with 3D Tilt */}
            <motion.div
              className="hero-portrait-wrapper"
              initial={{ opacity: 0, x: -50, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseMove={handlePortraitMove}
              onMouseLeave={handlePortraitLeave}
              style={{ perspective: 1000 }}
            >
              <motion.div
                className="gilded-frame"
                animate={{
                  rotateX: portraitTilt.x,
                  rotateY: portraitTilt.y,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                <div className="frame-filigree top-left" />
                <div className="frame-filigree top-right" />
                <div className="frame-filigree bottom-left" />
                <div className="frame-filigree bottom-right" />

                <div className="passe-partout">
                  <div className="portrait-container">
                    <img
                      src="/fel.jpeg"
                      alt="Dearest Felisha Oktarina Kustantri"
                      className="portrait-img"
                    />
                    <div className="portrait-vignette" />
                  </div>
                </div>

                <div className="engraved-plaque">
                  <div className="plaque-rivet left" />
                  <div className="plaque-text">
                    <span className="plaque-title">FELISHA OKTARINA KUSTANTRI</span>
                    <span className="plaque-subtitle">MY FAVORITE PERSON · 14.10</span>
                  </div>
                  <div className="plaque-rivet right" />
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Romantic & Dramatic Typography */}
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, x: 50, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="royal-crest-badge">
                <i className="fa-solid fa-heart" style={{ color: '#e63946' }} />
                <span>TODAY IS ALL ABOUT YOU · OCTOBER 14</span>
              </div>

              <h1 className="hero-title">
                <span className="hero-title-prefix">Happy Birthday, My Angel,</span>
                <span className="hero-title-name gold-gradient-text">Felisha Oktarina.</span>
              </h1>

              <p className="hero-lead">
                Out of billions of souls across this world, thank you for being born and choosing to walk into my life. Today is completely about you — your smile that is always my safe haven, your laughter that calms every storm, and how endlessly blessed I am to love someone as truly beautiful as you.
              </p>

              <div className="regal-divider">
                <span className="divider-line" />
                <span className="divider-crest">🌹</span>
                <span className="divider-line" />
              </div>

              <div className="hero-actions">
                <a href="#letter" onClick={handleHeroLetterClick} className="btn-royal-primary">
                  <i className="fa-solid fa-envelope-open-text" />
                  <span>Open Your Love Letter</span>
                </a>
                <a href="#candle" className="btn-royal-secondary">
                  <i className="fa-solid fa-cake-candles" />
                  <span>Blow Birthday Candle</span>
                </a>
              </div>

              <div className="hero-details-row">
                <div className="hero-detail-item">
                  <div className="detail-icon-box">
                    <i className="fa-regular fa-calendar-days" />
                  </div>
                  <div className="detail-body">
                    <span className="detail-label">OUR SPECIAL DAY</span>
                    <span className="detail-value">October 14</span>
                  </div>
                </div>
                <div className="hero-detail-item">
                  <div className="detail-icon-box">
                    <i className="fa-solid fa-heart" />
                  </div>
                  <div className="detail-body">
                    <span className="detail-label">WITH ALL MY HEART</span>
                    <span className="detail-value">From Raden to Felisha</span>
                  </div>
                </div>
                <div className="hero-detail-item">
                  <div className="detail-icon-box">
                    <i className="fa-solid fa-music" />
                  </div>
                  <div className="detail-body">
                    <span className="detail-label">OUR SONG</span>
                    <span className="detail-value">{PLAYLIST[currentTrackIndex].title}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <a href="#gallery" className="scroll-cue" aria-label="Scroll to memories section">
            <span>OUR MEMORIES</span>
            <i className="fa-solid fa-chevron-down" />
          </a>
        </section>

        {/* ═════════════════════════════════════════════════════════════════
             SECTION II: PRECIOUS MEMORIES & SWEET MOMENTS (OUR STORY)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="section-gallery" id="gallery">
          <div className="content-wrapper">
            <motion.header
              className="section-header"
              initial={{ opacity: 0, y: 35, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="chapter-number">OUR SWEET MOMENTS</span>
              <h2 className="section-heading gold-gradient-text">Precious Memories with You</h2>
              <div className="regal-divider mini">
                <span className="divider-line" />
                <span className="divider-crest">🌹</span>
                <span className="divider-line" />
              </div>
              <p className="section-desc">
                Every single second spent with you is a cherished chapter I hold forever close to my heart.
              </p>
            </motion.header>

            {/* Staggered Gallery Grid */}
            <div className="gallery-grid">
              {GALLERY_ITEMS.map((item, idx) => (
                <motion.article
                  key={idx}
                  className="gallery-card"
                  initial={{ opacity: 0, y: 45, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.85,
                    delay: idx * 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -6 }}
                  onClick={() => setLightbox({ isOpen: true, index: idx })}
                >
                  <div className="card-frame-inner">
                    <div className="card-media">
                      <img src={item.src} alt={item.title} loading="lazy" />
                    </div>
                    <div className="card-info">
                      <span className="card-meta">{item.meta}</span>
                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-excerpt">{item.excerpt}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════
             SECTION III: LOVE LETTER FOR FELISHA (HEARTFELT ROMANCE)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="section-letter" id="letter">
          <div className="content-wrapper narrow">
            <motion.header
              className="section-header"
              initial={{ opacity: 0, y: 35, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="chapter-number">A LETTER FROM MY HEART</span>
              <h2 className="section-heading gold-gradient-text">Love Letter for Felisha</h2>
              <div className="regal-divider mini">
                <span className="divider-line" />
                <span className="divider-crest">💌</span>
                <span className="divider-line" />
              </div>
              <p className="section-desc">
                Written with the very same love, flutter, and devotion as the first day I fell for you.
              </p>
            </motion.header>

            <div className="romantic-envelope-experience" id="envelope-container">
              {/* Outer Envelope Wrapper */}
              <div className={`envelope-interactive-box ${isEnvelopeOpen ? 'is-opened' : 'is-closed'}`}>
                {/* ─── WHEN CLOSED: Realistic 3D Midnight & Gold Envelope ─── */}
                {!isEnvelopeOpen && (
                  <motion.div
                    className="envelope-closed-display"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="envelope-body" onClick={handleOpenEnvelope}>
                      {/* Interior Lining */}
                      <div className="envelope-interior" />

                      {/* Letter Preview Tucked Inside */}
                      <div className="envelope-tucked-sheet" />

                      {/* Front Pocket */}
                      <div className="envelope-front-pocket">
                        <div className="pocket-corner left" />
                        <div className="pocket-corner right" />
                        <div className="pocket-bottom-fold" />
                        <div className="pocket-calligraphy">
                          <span className="pocket-to-label">TO MY BELOVED</span>
                          <strong className="pocket-recipient">Felisha Oktarina Kustantri</strong>
                          <span className="pocket-sender">From Raden, with All My Love · October 14</span>
                        </div>
                      </div>

                      {/* Top Flap with 3D Wax Seal */}
                      <div className="envelope-top-flap">
                        <div className="flap-shape" />
                        <button
                          type="button"
                          className="wax-seal-button"
                          onClick={handleOpenEnvelope}
                          aria-label="Open Wax Seal Love Letter"
                        >
                          <div className="wax-seal-disc">
                            <span className="wax-seal-icon">🌹</span>
                          </div>
                          <span className="wax-seal-text">OPEN LETTER</span>
                        </button>
                      </div>
                    </div>

                    {/* Action Prompt */}
                    <div className="envelope-action-prompt">
                      <button
                        type="button"
                        className="btn-royal-primary"
                        onClick={handleOpenEnvelope}
                      >
                        <i className="fa-solid fa-envelope-open" />
                        <span>Open Your Love Letter</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ─── WHEN OPENED: Majestic Full Parchment Letter In Natural Flow ─── */}
                <AnimatePresence>
                  {isEnvelopeOpen && (
                    <motion.div
                      className="envelope-opened-display"
                      ref={letterRef}
                      initial={{ opacity: 0, y: 35, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 25, scale: 0.97 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Top Open Flap Backing */}
                      <div className="opened-flap-ornament">
                        <span className="opened-seal-crest">🌹</span>
                        <span className="opened-tag">A LOVE LETTER FOR FELISHA</span>
                      </div>

                      {/* The Fine Letter Parchment */}
                      <article className="romantic-letter-parchment">
                        <div className="parchment-border-frame" />

                        {/* Letter Header */}
                        <div className="letter-header-row">
                          <span className="letter-date-loc">Bogor, October 14, 2024</span>
                          <span className="letter-center-rose">🌹</span>
                          <span className="letter-heart-tag">From the Depths of My Heart</span>
                        </div>

                        {/* Salutation */}
                        <h3 className="letter-salutation">
                          To Felisha, My Most Precious Person,
                        </h3>

                        {/* Heartfelt Body Text */}
                        <div className="letter-body-content">
                          <p className="letter-paragraph opening">
                            Happy birthday, my beloved angel.
                          </p>

                          <p className="letter-paragraph">
                            I might not always be the best at stringing together poetic words every single day. But on this extraordinary day of yours, I want you to know from the absolute depths of my heart: I am so profoundly grateful, truly blessed that God destined me to meet, know, and love someone as wonderful as you.
                          </p>

                          <p className="letter-paragraph">
                            Thank you, my love... Thank you for being born into this world. Thank you for your sweet, contagious laughter, the gentle way you smile that always quiets the storms in my mind, and the pure warmth of your heart that makes me fall in love with you over and over again. With you, even ordinary days become something magical. With you, I found the home my heart always longs to return to.
                          </p>

                          <p className="letter-paragraph">
                            As you turn a year older today, my wish for you is pure and everlasting: May you always be healthy, radiantly happy, and cradled in safety wherever life takes you. May every dream and hope you have whispered slowly come to life, one by one. Never feel alone, my darling... Because I will always be right here by your side, holding your hand, protecting you, and cheering for you at every single step.
                          </p>

                          <p className="letter-paragraph closing">
                            Happy birthday, love of my life. I love you more than words could ever explain.
                          </p>
                        </div>

                        {/* Sign-off Block */}
                        <div className="letter-closing-block">
                          <p className="closing-phrase">Written with all my love and warmest hugs,</p>
                          <div className="closing-signature">Raden ❤️</div>
                          <span className="closing-title">Forever Yours</span>
                        </div>

                        {/* Single Clean Refold Button */}
                        <div className="letter-refold-container">
                          <button
                            type="button"
                            className="btn-refold-letter"
                            onClick={handleCloseEnvelope}
                          >
                            <i className="fa-solid fa-envelope" />
                            <span>Fold Back into Envelope</span>
                          </button>
                        </div>
                      </article>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════
             SECTION IV: BLOW THE CANDLE & MAKE A WISH
        ══════════════════════════════════════════════════════════════════ */}
        <section className="section-candle" id="candle">
          <div className="content-wrapper text-center">
            <motion.header
              className="section-header"
              initial={{ opacity: 0, y: 35, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="chapter-number">MAKE A BIRTHDAY WISH</span>
              <h2 className="section-heading gold-gradient-text">Blow Out Your Birthday Candle</h2>
              <div className="regal-divider mini">
                <span className="divider-line" />
                <span className="divider-crest">🎂</span>
                <span className="divider-line" />
              </div>
              <p className="section-desc">
                Close your eyes for a moment, my love, make the most beautiful wish in your heart... then touch the flame to blow it out.
              </p>
            </motion.header>

            <motion.div
              className={`candle-stage ${isExtinguished ? 'is-extinguished' : ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="candle-halo" aria-hidden="true" />

              <div
                className={`candle-apparatus ${isExtinguished ? 'is-extinguished' : ''}`}
                role="button"
                tabIndex={0}
                onClick={handleExtinguishCandle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleExtinguishCandle(e);
                  }
                }}
                aria-label="Touch to blow birthday candle"
              >
                <div className="candle-smoke" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="candle-flame-wrapper">
                  <div className="flame-core" />
                  <div className="flame-glow" />
                </div>
                <div className="candle-wick" />

                <div className="candle-taper">
                  <div className="candle-wax-drip" />
                </div>

                <div className="candlestick-base">
                  <div className="base-rim" />
                  <div className="base-stem" />
                  <div className="base-foot" />
                </div>
              </div>

              {!isExtinguished && (
                <div className="candle-prompt">
                  <button
                    type="button"
                    className="btn-royal-primary"
                    onClick={handleExtinguishCandle}
                  >
                    <i className="fa-solid fa-wind" />
                    <span>Touch Flame to Blow Candle</span>
                  </button>
                </div>
              )}

              <AnimatePresence>
                {showWishReveal && (
                  <motion.div
                    className="wish-reveal"
                    initial={{ opacity: 0, y: 25, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="wish-reveal__card">
                      <div className="wish-crest">✨</div>
                      <span className="wish-tag">YOUR WISH HAS BEEN SENT TO THE UNIVERSE</span>
                      <h3 className="wish-title gold-gradient-text">
                        "May Joy & Your Beautiful Wishes Come True"
                      </h3>
                      <p className="wish-text">
                        May every prayer and wish you whispered silently in your heart be heard and granted one by one... And may one of those sweet wishes be us, growing old together in love.
                      </p>
                      <button
                        type="button"
                        className="btn-reignite"
                        onClick={handleReigniteCandle}
                      >
                        <i className="fa-solid fa-fire" />
                        <span>Light the Candle Again</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════
             SECTION V: THREE THINGS THAT MAKE ME FALL IN LOVE
        ══════════════════════════════════════════════════════════════════ */}
        <section className="section-reflections" id="reflections">
          <div className="content-wrapper">
            <motion.header
              className="section-header"
              initial={{ opacity: 0, y: 35, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="chapter-number">THE LITTLE THINGS</span>
              <h2 className="section-heading gold-gradient-text">Three Things That Make Me Fall in Love with You</h2>
              <div className="regal-divider mini">
                <span className="divider-line" />
                <span className="divider-crest">❤️</span>
                <span className="divider-line" />
              </div>
              <p className="section-desc">
                The little things about you that might seem simple to you, but are infinitely precious and extraordinary in my eyes.
              </p>
            </motion.header>

            <div className="reflections-grid">
              {[
                {
                  roman: '01',
                  badge: 'YOUR SMILE',
                  title: 'Serenity Amidst the Chaos',
                  body: 'Not only is it sweet, but your smile carries a gentle power that instantly melts away even the heaviest days, bringing peace to my soul in a single second.',
                },
                {
                  roman: '02',
                  badge: 'YOUR SINCERITY',
                  title: 'A Warm & Caring Heart',
                  body: 'The tenderness in how you treat me, your incredible patience, and the little thoughtful gestures that always make me feel deeply cherished and valued.',
                },
                {
                  roman: '03',
                  badge: 'MY HOME',
                  title: 'The Comfort of Being with You',
                  body: 'With you, I never have to pretend to be someone else. With you, I can be myself completely. You are the safest and warmest sanctuary I have ever found.',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="reflection-card"
                  initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.85,
                    delay: idx * 0.16,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -5 }}
                >
                  <span className="reflection-roman">{item.roman}</span>
                  <div className="reflection-badge">{item.badge}</div>
                  <h3 className="reflection-title">{item.title}</h3>
                  <p className="reflection-body">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════
             SECTION VI: LOVE NOTES & WISHES (GUESTBOOK)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="section-wishes" id="wishes">
          <div className="content-wrapper narrow">
            <motion.header
              className="section-header"
              initial={{ opacity: 0, y: 35, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="chapter-number">LOVE NOTES & WISHES</span>
              <h2 className="section-heading gold-gradient-text">Leave a Sweet Wish & Blessing</h2>
              <div className="regal-divider mini">
                <span className="divider-line" />
                <span className="divider-crest">💌</span>
                <span className="divider-line" />
              </div>
              <p className="section-desc">
                Write your heartfelt message, love note, or birthday wish for our sweet Felisha.
              </p>
            </motion.header>

            <motion.div
              className="wish-form-wrapper"
              initial={{ opacity: 0, y: 35, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <form onSubmit={handleWishSubmit} className="wish-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="wish-author">Your Name</label>
                    <input
                      type="text"
                      id="wish-author"
                      value={wishAuthor}
                      onChange={(e) => setWishAuthor(e.target.value)}
                      placeholder="e.g., Raden / Best Friend"
                      required
                      maxLength={50}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="wish-message">Your Sincere Message & Wish</label>
                  <textarea
                    id="wish-message"
                    rows={3}
                    value={wishMessage}
                    onChange={(e) => setWishMessage(e.target.value)}
                    placeholder="Write your sweetest birthday wishes and blessings for Felisha..."
                    required
                    maxLength={350}
                  />
                </div>
                <button type="submit" className="btn-royal-primary">
                  <i className="fa-solid fa-heart" style={{ color: '#e63946' }} />
                  <span>Send Love Note</span>
                </button>
              </form>
            </motion.div>

            {/* Wishes Feed with AnimatePresence */}
            <div className="wishes-feed">
              <AnimatePresence>
                {wishes.map((item) => (
                  <motion.div
                    key={item.id}
                    className="wish-card-item"
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="wish-card-header">
                      <span className="wish-card-author">{item.author}</span>
                      <span className="wish-card-time">{item.time}</span>
                    </div>
                    <p className="wish-card-msg">{item.message}</p>
                    <div className="wish-card-footer">
                      <button
                        type="button"
                        className={`btn-wish-amen ${userAmens[item.id] ? 'is-active' : ''}`}
                        onClick={() => handleAmen(item.id)}
                        title="Amen / Love"
                      >
                        <i className="fa-solid fa-heart" style={{ color: userAmens[item.id] ? '#e63946' : 'inherit' }} />
                        <span>Amen ({item.amens || 1})</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* ─── ROMANTIC FOOTER ─── */}
      <footer className="footer-editorial">
        <div className="content-wrapper text-center">
          <div className="footer-crest">🌹</div>
          <p className="footer-title gold-gradient-text">Happy Birthday, Felisha Oktarina</p>
          <p className="footer-subtitle">October 14 · Made with All My Love</p>
          <div className="regal-divider mini">
            <span className="divider-line" />
            <span className="divider-crest">❤️</span>
            <span className="divider-line" />
          </div>
          <p className="footer-copy">
            Dedicated from the deepest corner of my heart by Raden for my sweetest Felisha. May your smile shine forever.
          </p>
          <a href="#hero" className="back-to-top" aria-label="Back to top">
            <i className="fa-solid fa-chevron-up" />
            <span>BACK TO TOP</span>
          </a>
        </div>
      </footer>

      {/* ─── FLOATING AUDIO DOCK WITH PROGRESS SCRUBBER ─── */}
      <div className={`audio-dock ${isPlaying ? 'is-playing' : ''} ${isAudioDockMinimized ? 'is-minimized' : ''}`}>
        <audio
          ref={audioRef}
          preload="auto"
          onEnded={nextTrack}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {isAudioDockMinimized ? (
          <button
            type="button"
            className="dock-mini-pill"
            onClick={() => setIsAudioDockMinimized(false)}
            aria-label="Expand Music Player"
          >
            <div className="dock-disc mini">
              <i className="fa-solid fa-compact-disc" />
            </div>
            <div className="dock-mini-info">
              <span className="dock-mini-title">{PLAYLIST[currentTrackIndex].title}</span>
              <span className="dock-mini-status">
                {isPlaying ? (
                  <span className="sound-bars mini" aria-hidden="true">
                    <i /><i /><i />
                  </span>
                ) : (
                  <span>Paused</span>
                )}
              </span>
            </div>
            <i className="fa-solid fa-chevron-up dock-mini-expand" />
          </button>
        ) : (
          <div className="dock-inner">
            <div className="dock-disc" onClick={togglePlay} role="button" tabIndex={0} title={isPlaying ? 'Pause' : 'Play'}>
              <i className="fa-solid fa-compact-disc" />
            </div>

            <div className="dock-track-info">
              <div className="dock-track-header">
                <span className="track-label">OUR SONG</span>
                <button
                  type="button"
                  className="dock-minimize-btn"
                  onClick={() => setIsAudioDockMinimized(true)}
                  aria-label="Minimize Music Player"
                  title="Minimize"
                >
                  <i className="fa-solid fa-chevron-down" />
                </button>
              </div>
              <span className="track-title">{PLAYLIST[currentTrackIndex].title}</span>
              <div className="track-scrubber-row">
                <span className="track-time">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  className="track-scrubber"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Music Progress"
                />
                <span className="track-time">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="dock-controls">
              <button
                type="button"
                className="dock-btn"
                onClick={prevTrack}
                title="Previous Track"
                aria-label="Previous Track"
              >
                <i className="fa-solid fa-backward-step" />
              </button>
              <button
                type="button"
                className="dock-btn play-btn"
                onClick={togglePlay}
                title="Play Music"
                aria-label="Play Music"
              >
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
              </button>
              <button
                type="button"
                className="dock-btn"
                onClick={nextTrack}
                title="Next Track"
                aria-label="Next Track"
              >
                <i className="fa-solid fa-forward-step" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── IMAGE LIGHTBOX MODAL WITH KEYBOARD NAVIGATION ─── */}
      <AnimatePresence>
        {lightbox.isOpen && (
          <motion.div
            className="editorial-lightbox is-open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            onClick={() => setLightbox({ isOpen: false, index: 0 })}
          >
            <button
              className="lightbox-close"
              type="button"
              onClick={() => setLightbox({ isOpen: false, index: 0 })}
              aria-label="Close Preview"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_ITEMS[lightbox.index].src}
                alt={GALLERY_ITEMS[lightbox.index].title}
              />
              <p className="lightbox-caption">{GALLERY_ITEMS[lightbox.index].caption}</p>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1rem',
                  justifyContent: 'center',
                }}
              >
                <button
                  type="button"
                  className="btn-royal-secondary"
                  onClick={() =>
                    setLightbox((prev) => ({
                      ...prev,
                      index: (prev.index - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length,
                    }))
                  }
                >
                  <i className="fa-solid fa-arrow-left" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  className="btn-royal-secondary"
                  onClick={() =>
                    setLightbox((prev) => ({
                      ...prev,
                      index: (prev.index + 1) % GALLERY_ITEMS.length,
                    }))
                  }
                >
                  <span>Next</span>
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
