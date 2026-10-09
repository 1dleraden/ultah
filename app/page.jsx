  'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import InfiniteSpiral from '../components/InfiniteSpiral';

const PLAYLIST = [
  {
    title: 'Aku Milikmu (I Am Yours) — Dewa 19',
    src: encodeURI('/Aku Milikmu - Dewa 19 (Lyrics Video).mp3'),
  },
  {
    title: 'Always — Daniel Caesar',
    src: encodeURI('/Daniel Caesar - Always (Lyrics).mp3'),
  },
  {
    title: 'Kangen (Longing for You) — Dewa 19',
    src: encodeURI('/Dewa 19 - Kangen (Official Audio).mp3'),
  },
  {
    title: 'Panasea — rumahsakit',
    src: encodeURI('/rumahsakit - Panasea (Official Music Video).mp3'),
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
    secretNote: 'Foto ini selalu jadi salah satu favoritku. Waktu itu kamu senyum lepas banget, dan di saat itu juga aku sadar kalau senyummu punya kekuatan luar biasa buat bikin tenang segala isi kepalaku.',
    date: 'A Beautiful Sunny Day',
  },
  {
    src: '/moment2.jpeg',
    plate: 'MOMENT 02',
    meta: 'SWEET MEMORY · 02',
    title: 'Lost in Our Laughter & Stories',
    excerpt: '"Moments where time seems to stand still whenever we are together. No matter how exhausting the world gets, talking to you is always my favorite cure."',
    caption: 'Every second of our late-night talks, effortless laughter, and shared moments that I cherish every single day.',
    secretNote: 'Momen kita ngobrol berjam-jam tanpa kerasa. Apapun topik pembicaraan kita, rasanya waktu selalu jalan terlalu cepat kalau lagi sama kamu.',
    date: 'Late Night Conversations',
  },
  {
    src: '/momnt3.jpeg',
    plate: 'MOMENT 03',
    meta: 'SWEET MEMORY · 03',
    title: 'The Journey We Walk Together',
    excerpt: '"Thank you for always being by my side, walking gently with me without ever rushing. Holding your hand is the safest feeling in the universe."',
    caption: 'Walking side by side with you, embracing each new day with boundless gratitude in my heart.',
    secretNote: 'Setiap langkah yang pernah kita laluin bareng. Walau sekarang kita melangkah di jalan masing-masing, terima kasih sudah pernah mengisi perjalananku dengan cerita yang begitu indah.',
    date: 'Footsteps Side by Side',
  },
  {
    src: '/moment4.jpeg',
    plate: 'MOMENT 04',
    meta: 'SWEET MEMORY · 04',
    title: 'Where My Heart Calls Home',
    excerpt: '"In whatever corner of the earth I wander, my heart will always find its way back to you. You are the warmest home I have ever known."',
    caption: 'A tender promise to always cherish, protect, and stand beside you forever and always.',
    secretNote: 'Doa tulus dari sudut terdalam hatiku untuk kebahagiaanmu. Ke mana pun takdir membawamu, aku akan selalu bangga dan mendoakan hal-hal terbaik buatmu, Fel.',
    date: 'Forever in My Prayers',
  },
];

const SPIRAL_ITEMS = [
  { id: 'sp-1', src: '/fel.jpeg', alt: 'Felisha Oktarina', label: 'Felisha · 14.10' },
  { id: 'sp-2', src: '/momnt1.jpeg', alt: 'Senyum Termani', label: 'Sweet Smile' },
  { id: 'sp-3', src: '/moment2.jpeg', alt: 'Cerita & Tawa Kita', label: 'Our Laughter' },
  { id: 'sp-4', src: '/momnt3.jpeg', alt: 'Langkah Bersamamu', label: 'Walking Together' },
  { id: 'sp-5', src: '/moment4.jpeg', alt: 'Rumah Hatiku', label: 'Warm Home' },
  { id: 'sp-6', src: '/fel.jpeg', alt: 'Tatapan Favoritku', label: 'Favorite Person' },
  { id: 'sp-7', src: '/momnt1.jpeg', alt: 'Kebahagiaan Murni', label: 'Pure Bliss' },
  { id: 'sp-8', src: '/moment2.jpeg', alt: 'Obrolan Larut Malam', label: 'Late Talks' },
  { id: 'sp-9', src: '/momnt3.jpeg', alt: 'Petualangan Berdua', label: 'Journey' },
  { id: 'sp-10', src: '/moment4.jpeg', alt: 'Selamanya Untukmu', label: 'Forever Mine' },
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

// Realistic Synthesized Party Popper POP sound using Web Audio API
const playPopperSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // 1. Bass "thump" of the popper blast chamber
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.11);
    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    // 2. High snappy "crack/pop" of the party popper cap
    const bufferSize = Math.floor(ctx.sampleRate * 0.14);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.024));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1600, now);
    noiseFilter.Q.setValueAtTime(1.1, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.48, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.14);
  } catch {
    // Non-blocking fallback
  }
};

// Grand Multi-Stage Party Popper Celebration Cannon
const triggerGrandPartyPopperCelebration = (customOriginX = null, customOriginY = null) => {
  if (typeof window === 'undefined') return;
  playPopperSound();
  import('canvas-confetti').then((module) => {
    const confetti = module.default;
    const celebrationColors = [
      '#e63946', '#ff4d6d', '#ff758f', '#fa5252', // Radiant Ruby & Rose
      '#dfba73', '#f5c518', '#ffd166', '#fae8ba', // 24K Gold & Champagne
      '#7209b7', '#9d4edd', '#c77dff', // Royal Violet & Purple
      '#4cc9f0', '#06d6a0', '#2ec4b6', // Festive Turquoise & Emerald
      '#ffffff',
    ];

    // Stage 1: Dual Bottom Cannons (Party Poppers 🎉 Firing from Left & Right Corners)
    confetti({
      particleCount: 85,
      angle: 60,
      spread: 75,
      origin: { x: 0.04, y: 0.92 },
      colors: celebrationColors,
      startVelocity: 65,
      gravity: 0.72,
      scalar: 1.15,
      shapes: ['star', 'circle', 'square'],
      ticks: 320,
      disableForReducedMotion: true,
    });

    confetti({
      particleCount: 85,
      angle: 120,
      spread: 75,
      origin: { x: 0.96, y: 0.92 },
      colors: celebrationColors,
      startVelocity: 65,
      gravity: 0.72,
      scalar: 1.15,
      shapes: ['star', 'circle', 'square'],
      ticks: 320,
      disableForReducedMotion: true,
    });

    // If custom origin specified (e.g., clicked element on screen)
    if (customOriginX !== null && customOriginY !== null) {
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { x: customOriginX, y: customOriginY },
        colors: celebrationColors,
        startVelocity: 48,
        gravity: 0.8,
        scalar: 1.2,
        shapes: ['star', 'circle', 'square'],
        ticks: 280,
      });
    }

    // Stage 2 (+280ms): High-volume center fireworks burst
    setTimeout(() => {
      confetti({
        particleCount: 110,
        spread: 120,
        origin: { x: 0.5, y: 0.6 },
        colors: celebrationColors,
        startVelocity: 52,
        gravity: 0.75,
        scalar: 1.25,
        shapes: ['star', 'circle'],
        ticks: 340,
      });
    }, 280);

    // Stage 3 (+650ms): Cross-fire streamers criss-crossing screen
    setTimeout(() => {
      confetti({
        particleCount: 65,
        angle: 45,
        spread: 60,
        origin: { x: 0.12, y: 0.8 },
        colors: celebrationColors,
        startVelocity: 58,
        gravity: 0.78,
      });
      confetti({
        particleCount: 65,
        angle: 135,
        spread: 60,
        origin: { x: 0.88, y: 0.8 },
        colors: celebrationColors,
        startVelocity: 58,
        gravity: 0.78,
      });
    }, 650);

    // Stage 4 (+1100ms): Golden Stars & Hearts cascading from the ceiling
    setTimeout(() => {
      confetti({
        particleCount: 65,
        spread: 140,
        origin: { x: 0.5, y: 0.22 },
        colors: ['#dfba73', '#f5c518', '#fae8ba', '#ffd166', '#ff4d6d', '#ffffff'],
        startVelocity: 35,
        gravity: 0.55,
        scalar: 1.3,
        shapes: ['star'],
        ticks: 300,
      });
    }, 1100);
  });
};

// Directional Single Party Popper Blast (for interactive corner popper cannons)
const triggerCornerPopper = (side = 'left') => {
  if (typeof window === 'undefined') return;
  playPopperSound();
  import('canvas-confetti').then((module) => {
    const confetti = module.default;
    const colors = [
      '#e63946', '#ff4d6d', '#ff758f', '#fa5252',
      '#dfba73', '#f5c518', '#ffd166',
      '#7209b7', '#4cc9f0', '#06d6a0', '#ffffff',
    ];
    const isLeft = side === 'left';
    confetti({
      particleCount: 90,
      angle: isLeft ? 55 : 125,
      spread: 70,
      origin: { x: isLeft ? 0.05 : 0.95, y: 0.88 },
      colors,
      startVelocity: 68,
      gravity: 0.72,
      scalar: 1.2,
      shapes: ['star', 'circle', 'square'],
      ticks: 320,
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

  // 3D Flip Card state for Gallery
  const [flippedCardIdx, setFlippedCardIdx] = useState(null);

  // Responsive Mobile Viewport Detection
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [spiralMode, setSpiralMode] = useState('ring'); // 'ring' (pristine 3D carousel) or 'helix' (gentle 3D staircase)
  const [isSpiralPaused, setIsSpiralPaused] = useState(false);
  const spiralRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  // Real-time Birthday Countdown (Target: October 14)
  const [birthdayCountdown, setBirthdayCountdown] = useState({
    isBirthdayToday: false,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Preview Hari-H mode & one-time opening celebration trigger
  const [isPreviewHariH, setIsPreviewHariH] = useState(false);
  const hasCelebratedOnEnterRef = useRef(false);

  // Check URL params for testing Hari-H preview (?harih=true or ?dday=true)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('harih') === 'true' || searchParams.get('dday') === 'true') {
        setIsPreviewHariH(true);
      }
    }
  }, []);

  // Real Microphone Blow Detection for Birthday Cake
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [micStatusText, setMicStatusText] = useState('');
  const micStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const micAnimFrameRef = useRef(null);



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

  // Enter Gala / Open Birthday Gift Handler ("Saat Memencet Masuk")
  const handleEnterGala = (e) => {
    if (isPreloaderEntered) return;

    let originX = 0.5;
    let originY = 0.6;
    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = (rect.top + rect.height / 2) / window.innerHeight;
    }

    // On Hari-H: Fire grand celebratory party poppers immediately when pressing masuk!
    if (birthdayCountdown.isBirthdayToday) {
      triggerGrandPartyPopperCelebration(originX, originY);
      // Second grand celebratory wave as shutters fully open
      setTimeout(() => {
        triggerGrandPartyPopperCelebration();
      }, 1000);
    } else {
      triggerRomanticSparks({ x: originX, y: originY });
    }

    // Start music smoothly with Aku Milikmu
    if (audioRef.current) {
      const akuMilikmuIdx = PLAYLIST.findIndex((t) => t.title.toLowerCase().includes('aku milikmu'));
      const targetIdx = akuMilikmuIdx !== -1 ? akuMilikmuIdx : 0;
      setCurrentTrackIndex(targetIdx);
      audioRef.current.src = PLAYLIST[targetIdx].src;
      audioRef.current.load();
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

  // Birthday Countdown Effect (Target: October 14)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const isActualToday = now.getMonth() === 9 && now.getDate() === 14;
      const isToday = isActualToday || isPreviewHariH;

      if (isToday) {
        setBirthdayCountdown({ isBirthdayToday: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const targetDate = new Date(currentYear, 9, 14, 0, 0, 0);
      let diff = targetDate.getTime() - now.getTime();
      if (diff < 0) {
        const nextYearTarget = new Date(currentYear + 1, 9, 14, 0, 0, 0);
        diff = nextYearTarget.getTime() - now.getTime();
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setBirthdayCountdown({ isBirthdayToday: false, days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [isPreviewHariH]);

  // Automatic Party Popper blast when website opens directly on Hari-H
  useEffect(() => {
    if (birthdayCountdown.isBirthdayToday && isPreloaderEntered && !hasCelebratedOnEnterRef.current) {
      hasCelebratedOnEnterRef.current = true;
      triggerGrandPartyPopperCelebration();
    }
  }, [birthdayCountdown.isBirthdayToday, isPreloaderEntered]);

  // Interactive Party Popper Handlers
  const handleToggleHariHPreview = () => {
    const nextVal = !isPreviewHariH;
    setIsPreviewHariH(nextVal);
    if (nextVal) {
      setTimeout(() => {
        triggerGrandPartyPopperCelebration();
      }, 100);
    }
  };

  const handleFirePartyPopper = (e) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;
      triggerGrandPartyPopperCelebration(originX, originY);
    } else {
      triggerGrandPartyPopperCelebration();
    }
  };

  // Stop Microphone Helper
  const stopMicDetection = () => {
    if (micAnimFrameRef.current) cancelAnimationFrame(micAnimFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsListeningMic(false);
    setMicVolume(0);
  };

  // Toggle Real Microphone Blow Detection
  const toggleMicBlowDetection = async () => {
    if (isListeningMic) {
      stopMicDetection();
      setMicStatusText('');
      return;
    }

    if (isExtinguished) return;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicStatusText('Perangkat belum mendukung akses mic. Sentuh kue langsung untuk meniup lilin!');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.25;
      source.connect(analyser);

      setIsListeningMic(true);
      setMicStatusText('🎙️ Mic aktif! Dekatkan mulut ke mic HP/laptop lalu TIUP...');

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let blowCounter = 0;

      const checkBlow = () => {
        if (!micStreamRef.current) return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        let lowSum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
          if (i < 24) lowSum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const lowAvg = lowSum / 24;
        const vol = Math.min(100, Math.round((avg / 128) * 100));
        setMicVolume(vol);

        if (lowAvg > 46 || avg > 42) {
          blowCounter++;
        } else {
          blowCounter = Math.max(0, blowCounter - 1);
        }

        if (blowCounter >= 3) {
          setMicStatusText('✨ Tiupanmu terdeteksi! Lilin telah padam!');
          stopMicDetection();
          handleExtinguishCandle(null);
          return;
        }

        micAnimFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch (err) {
      console.warn('Microphone error:', err);
      setMicStatusText('Izin mic tidak diberikan. Kamu tetap bisa menyentuh kue langsung!');
      setIsListeningMic(false);
    }
  };

  // Clean up microphone detection when extinguished or unmounting
  useEffect(() => {
    if (isExtinguished) {
      stopMicDetection();
    }
    return () => stopMicDetection();
  }, [isExtinguished]);



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

            {!birthdayCountdown.isBirthdayToday ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '999px',
                  background: 'rgba(200, 146, 17, 0.1)',
                  border: '1px solid rgba(200, 146, 17, 0.35)',
                  fontSize: '0.78rem',
                  color: 'var(--gold-deep)',
                  margin: '0.5rem 0 1.1rem 0',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span>⏳ Menuju Hari-H:</span>
                <span style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.04em', color: 'var(--text-white)', fontWeight: 700 }}>
                  {String(birthdayCountdown.days).padStart(2, '0')}h : {String(birthdayCountdown.hours).padStart(2, '0')}j : {String(birthdayCountdown.minutes).padStart(2, '0')}m : {String(birthdayCountdown.seconds).padStart(2, '0')}d
                </span>
              </div>
            ) : (
              <div className="preloader-harih-badge">
                <span className="popper-emoji-bounce">🎉</span>
                <span>HARI INI HARI-H ULANG TAHUN FELISHA!</span>
                <span className="popper-emoji-bounce">🎉</span>
              </div>
            )}

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
                {birthdayCountdown.isBirthdayToday
                  ? loadProgress < 100
                    ? '🎉 Menyiapkan letupan kejutan ulang tahun Hari-H...'
                    : '🎉 Hadiah Ulang Tahun Hari-H Siap Dibuka!'
                  : loadProgress < 30
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
                {birthdayCountdown.isBirthdayToday ? (
                  <>
                    <span className="popper-emoji-bounce">🎉</span>
                    <span>Masuk & Buka Hadiah Hari-H</span>
                    <span className="popper-emoji-bounce">🎊</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-gift" />
                    <span>Masuk & Buka Hadiah Ulang Tahun</span>
                    <i className="fa-solid fa-heart" style={{ color: '#e63946' }} />
                  </>
                )}
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
            <a href="#candle" className={`nav-link ${activeSection === 'candle' ? 'active' : ''}`}>
              MAKE A WISH
            </a>
            <span className="nav-sep">·</span>
            <a href="#reflections" className={`nav-link ${activeSection === 'reflections' ? 'active' : ''}`}>
              ABOUT YOU
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

              {/* ─── GRAND LUXURY BIRTHDAY COUNTDOWN (HIDDEN ON HARI-H) ─── */}
              {!birthdayCountdown.isBirthdayToday && (
                <div className="luxury-countdown-card">
                  <div className="countdown-card-header">
                    <span className="countdown-pulse-dot" />
                    <span className="countdown-card-title">
                      COUNTDOWN TO OCTOBER 14 · HARI SPESIAL FELISHA
                    </span>
                  </div>

                  <div className="countdown-digits-grid">
                    <div className="digit-box">
                      <span className="digit-num gold-gradient-text">
                        {String(birthdayCountdown.days).padStart(2, '0')}
                      </span>
                      <span className="digit-label">HARI</span>
                    </div>
                    <span className="digit-colon">:</span>
                    <div className="digit-box">
                      <span className="digit-num gold-gradient-text">
                        {String(birthdayCountdown.hours).padStart(2, '0')}
                      </span>
                      <span className="digit-label">JAM</span>
                    </div>
                    <span className="digit-colon">:</span>
                    <div className="digit-box">
                      <span className="digit-num gold-gradient-text">
                        {String(birthdayCountdown.minutes).padStart(2, '0')}
                      </span>
                      <span className="digit-label">MENIT</span>
                    </div>
                    <span className="digit-colon">:</span>
                    <div className="digit-box digit-box-seconds">
                      <span className="digit-num gold-gradient-text">
                        {String(birthdayCountdown.seconds).padStart(2, '0')}
                      </span>
                      <span className="digit-label">DETIK</span>
                    </div>
                  </div>
                </div>
              )}

              <h1 className="hero-title">
                <span className="hero-title-prefix">Happy Birthday,</span>
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
                <a href="#candle" className="btn-royal-primary">
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
              <span className="chapter-number">MOMEN-MOMEN MANIS KITA</span>
              <h2 className="section-heading gold-gradient-text">Kenangan yg Tidak Akan Bisa Terulang Lagi</h2>
              <div className="regal-divider mini">
                <span className="divider-line" />
                <span className="divider-crest">🌹</span>
                <span className="divider-line" />
              </div>
              <p className="section-desc">
                Every single second spent with you is a cherished chapter I hold forever close to my heart.
              </p>
            </motion.header>

            {/* ─── 3D INFINITE SPIRAL GALLERY (REACT BITS) ─── */}
            <motion.div
              className="spiral-showcase-container"
              initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="spiral-showcase-header">
                <span className="spiral-tag">
                  <i className="fa-solid fa-cube" /> GALERI 3D MEMORI FELISHA
                </span>
                <h3 className="gold-gradient-text spiral-heading">
                  {spiralMode === 'ring' ? 'Orbit Carousel 3D Felisha' : 'Spiral 3D Memori Kita'}
                </h3>
                <p className="spiral-sub">
                  Koleksi potret terindah Felisha Oktarina yang berputar dalam dimensi 3D elegan.
                </p>

                {/* Mode Selector Tabs */}
                <div className="spiral-mode-tabs">
                  <button
                    type="button"
                    className={`spiral-tab-btn ${spiralMode === 'ring' ? 'active' : ''}`}
                    onClick={() => setSpiralMode('ring')}
                  >
                    <i className="fa-solid fa-circle-notch" />
                    <span>Carousel Melingkar (Rapi)</span>
                  </button>
                  <button
                    type="button"
                    className={`spiral-tab-btn ${spiralMode === 'helix' ? 'active' : ''}`}
                    onClick={() => setSpiralMode('helix')}
                  >
                    <i className="fa-solid fa-dna" />
                    <span>Spiral Tangga 3D</span>
                  </button>
                </div>
              </div>

              <div className="spiral-stage-wrapper">
                <InfiniteSpiral
                  ref={spiralRef}
                  items={SPIRAL_ITEMS}
                  animationMode="auto"
                  speed={isMobileScreen ? 0.32 : 0.42}
                  radius={
                    spiralMode === 'ring'
                      ? (isMobileScreen ? 112 : 190)
                      : (isMobileScreen ? 94 : 170)
                  }
                  cardWidth={
                    spiralMode === 'ring'
                      ? (isMobileScreen ? 88 : 124)
                      : (isMobileScreen ? 78 : 115)
                  }
                  cardHeight={
                    spiralMode === 'ring'
                      ? (isMobileScreen ? 88 : 124)
                      : (isMobileScreen ? 78 : 115)
                  }
                  verticalSpacing={
                    spiralMode === 'ring'
                      ? 0
                      : (isMobileScreen ? 24 : 44)
                  }
                  perspective={isMobileScreen ? 780 : 1000}
                  cardRadius={isMobileScreen ? 12 : 14}
                  centerScale={isMobileScreen ? 1.18 : 1.25}
                  edgeBlur={0}
                  edgeFade={0.35}
                  cardsPerTurn={isMobileScreen ? 6 : 7}
                  pauseOnHover={true}
                  imageFit="cover"
                />
              </div>

              {/* Interactive Control Row */}
              <div className="spiral-controls-row">
                <button
                  type="button"
                  className="spiral-ctrl-btn"
                  onClick={() => spiralRef.current?.prev()}
                  title="Foto Sebelumnya"
                  aria-label="Previous Photo"
                >
                  <i className="fa-solid fa-backward-step" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  className={`spiral-ctrl-btn play ${isSpiralPaused ? 'is-paused' : ''}`}
                  onClick={() => {
                    const paused = spiralRef.current?.togglePause();
                    setIsSpiralPaused(Boolean(paused));
                  }}
                  title={isSpiralPaused ? 'Putar Otomatis' : 'Jeda Putaran'}
                  aria-label="Toggle Play Pause"
                >
                  <i className={`fa-solid ${isSpiralPaused ? 'fa-play' : 'fa-pause'}`} />
                  <span>{isSpiralPaused ? 'Putar' : 'Jeda'}</span>
                </button>
                <button
                  type="button"
                  className="spiral-ctrl-btn"
                  onClick={() => spiralRef.current?.next()}
                  title="Foto Selanjutnya"
                  aria-label="Next Photo"
                >
                  <span>Selanjutnya</span>
                  <i className="fa-solid fa-forward-step" />
                </button>
              </div>

              <div className="spiral-instruction-badge">
                <i className="fa-solid fa-sparkles" />
                <span>Ketuk salah satu foto untuk memfokuskannya ke depan, atau gunakan tombol kontrol di atas</span>
              </div>
            </motion.div>

            {/* Staggered Gallery Grid with 3D Flip */}
            <div className="gallery-grid">
              {GALLERY_ITEMS.map((item, idx) => {
                const isFlipped = flippedCardIdx === idx;
                return (
                  <motion.article
                    key={idx}
                    className="gallery-card gallery-flip-container"
                    initial={{ opacity: 0, y: 45, filter: 'blur(4px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.85,
                      delay: idx * 0.14,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: isFlipped ? 0 : -6 }}
                  >
                    <div className={`gallery-flip-box ${isFlipped ? 'is-flipped' : ''}`}>
                      {/* FRONT: Photo & Excerpt */}
                      <div className="gallery-flip-front">
                        <div className="card-frame-inner">
                          <div
                            className="card-media"
                            onClick={() => setLightbox({ isOpen: true, index: idx })}
                            role="button"
                            tabIndex={0}
                            title="Klik untuk perbesar foto"
                            style={{ cursor: 'pointer' }}
                          >
                            <img src={item.src} alt={item.title} loading="lazy" />
                          </div>
                          <div className="card-info">
                            <span className="card-meta">{item.meta}</span>
                            <h3 className="card-title">{item.title}</h3>
                            <p className="card-excerpt">{item.excerpt}</p>
                            <button
                              type="button"
                              className="btn-flip-card"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFlippedCardIdx(isFlipped ? null : idx);
                              }}
                            >
                              <i className="fa-solid fa-envelope-open-text" />
                              <span>Baca Catatan Rahasia di Balik Foto</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* BACK: Vintage Postal Card & Secret Thought */}
                      <div className="gallery-flip-back">
                        <div className="card-back-header">
                          <span className="card-back-tag">🌹 DEAR FELISHA</span>
                          <span className="card-back-stamp">{item.plate}</span>
                        </div>
                        <div className="card-back-content">
                          <span className="card-back-date">📍 {item.date}</span>
                          <p className="card-back-note">"{item.secretNote}"</p>
                        </div>
                        <button
                          type="button"
                          className="btn-flip-card"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlippedCardIdx(null);
                          }}
                        >
                          <i className="fa-solid fa-camera-retro" />
                          <span>Kembali ke Tampilan Foto</span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
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
                          <span className="letter-center-rose">🌹</span>
                          <span className="letter-heart-tag">From the Depths of My Heart</span>
                        </div>

                        {/* Salutation */}
                        <h3 className="letter-salutation">
                          To Felisha,
                        </h3>

                        {/* Heartfelt Body Text */}
                        <div className="letter-body-content">
                          <p className="letter-paragraph opening">
                            Happy birthday, Felisha Oktarina Kustantri. Aku harap di umur kamu yang sekarang, kamu menemukan hal-hal baik ya, dan semoga kamu mencapai apa yang kamu ingin.
                          </p>

                          <p className="letter-paragraph">
                            Aku cuma mau bilang makasih ke kamu karna kamu udah datang ke hidup aku. Makasih juga udah buat aku ngerasa bahagia selama sebulan ini. Aku nggak nyangka bakal diterima sama kamu, walau akhirnya putus juga.
                          </p>

                          <p className="letter-paragraph">
                            <em>I&apos;m so sorry</em> ya, aku kemarin udah bilang hal-hal yang nggak enak ke kamu pas kita putus. Soalnya aku sempat <em>shock</em> pas kamu bilang <em>flat</em>, pas itu aku juga lagi main, jadi gatau aku mau gimana. Aku udah bingung banget pas diputusin kamu, soalnya selama aku pacaran cuma kamu yang sampai kenal adik-adik aku. Ini juga versi terbaik aku yang nggak pernah aku kasih ke yang lain, jadi ya aku agak gimana gitu, mikir kalau di akunya ada yang kurang.
                          </p>

                          <p className="letter-paragraph">
                            <em>Once again, I&apos;m really sorry</em> kalau aku kemarin kesannya kayak nggak terima kalau diputusin, padahal aku tau kamu udah hilang rasa, tapi akunya masih maksa.
                          </p>

                          <p className="letter-paragraph closing">
                            <em>Maybe</em> untuk sekarang aku belum bisa lupain kamu... tapi suatu saat aku pasti bakal bisa lupain n lepasin kamu kok. Untuk sekarang biarin aku <em>stalk</em> kamu terus ya, ada saatnya aku berhenti <em>stalking</em> kamu, dan memulai kembali kehidupan aku seperti semula.
                          </p>
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
              <h2 className="section-heading gold-gradient-text">Blow Out Your Birthday Cake</h2>
              <div className="regal-divider mini">
                <span className="divider-line" />
                <span className="divider-crest">🎂</span>
                <span className="divider-line" />
              </div>
              <p className="section-desc">
                Close your eyes for a moment, my love, make the most beautiful wish in your heart... then touch the cake to blow out your candles.
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
                className={`birthday-cake-apparatus ${isExtinguished ? 'is-extinguished' : ''}`}
                role="button"
                tabIndex={0}
                onClick={handleExtinguishCandle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleExtinguishCandle(e);
                  }
                }}
                aria-label="Touch cake to blow out candles"
              >
                {/* 3 Birthday Candles on Top of Cake */}
                <div className="cake-candles-row">
                  {/* Left Candle */}
                  <div className="cake-candle candle-left">
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
                    <div className="cake-candle-stick candle-stick-left" />
                  </div>

                  {/* Center Candle (Tallest) */}
                  <div className="cake-candle candle-center">
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
                    <div className="cake-candle-stick candle-stick-center" />
                  </div>

                  {/* Right Candle */}
                  <div className="cake-candle candle-right">
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
                    <div className="cake-candle-stick candle-stick-right" />
                  </div>
                </div>

                {/* Cake Garnish: Strawberries, Rose & Cream Swirls */}
                <div className="cake-toppings">
                  <span className="topping-item topping-strawberry left">🍓</span>
                  <span className="topping-swirl" />
                  <span className="topping-item topping-rose">🌹</span>
                  <span className="topping-swirl" />
                  <span className="topping-item topping-strawberry right">🍓</span>
                </div>

                {/* Tier 2: Top Tier */}
                <div className="cake-tier tier-top">
                  <div className="cake-glaze-drip glaze-top">
                    <span className="drip d1" />
                    <span className="drip d2" />
                    <span className="drip d3" />
                    <span className="drip d4" />
                    <span className="drip d5" />
                  </div>
                  <div className="tier-decor">
                    <span className="tier-monogram">Felisha · 14.10</span>
                  </div>
                  <div className="tier-pearls">
                    <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
                  </div>
                </div>

                {/* Tier 1: Bottom Tier */}
                <div className="cake-tier tier-bottom">
                  <div className="cake-glaze-drip glaze-bottom">
                    <span className="drip d1" />
                    <span className="drip d2" />
                    <span className="drip d3" />
                    <span className="drip d4" />
                    <span className="drip d5" />
                    <span className="drip d6" />
                    <span className="drip d7" />
                  </div>
                  <div className="gold-ribbon-belt">
                    <span className="ribbon-sparkle">✨ WITH ALL MY LOVE ✨</span>
                  </div>
                  <div className="tier-pearls bottom">
                    <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
                  </div>
                </div>

                {/* Luxury Gilded Cake Pedestal / Stand */}
                <div className="cake-stand">
                  <div className="cake-stand-platter">
                    <div className="platter-edge-beading" />
                  </div>
                  <div className="cake-stand-stem" />
                  <div className="cake-stand-base" />
                </div>
              </div>

              {!isExtinguished && (
                <div className="candle-prompt">
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-royal-primary"
                      onClick={handleExtinguishCandle}
                    >
                      <i className="fa-solid fa-wind" />
                      <span>Sentuh Kue untuk Tiup Lilin</span>
                    </button>

                    <button
                      type="button"
                      className={`btn-mic-toggle ${isListeningMic ? 'is-listening' : ''}`}
                      onClick={toggleMicBlowDetection}
                      title="Tiup langsung ke lubang mikrofon perangkat"
                    >
                      <i className={`fa-solid ${isListeningMic ? 'fa-microphone-lines' : 'fa-microphone'}`} />
                      <span>{isListeningMic ? 'Matikan Sensor Mic' : '🎤 Tiup Pakai Mikrofon HP/Laptop'}</span>
                    </button>
                  </div>

                  {isListeningMic && (
                    <div className="mic-blow-panel">
                      <div className="mic-visualizer-wrap">
                        <div
                          className="mic-visualizer-bar"
                          style={{ width: `${Math.max(5, micVolume)}%` }}
                        />
                      </div>
                      <p className="mic-status-text">
                        {micStatusText || '🎙️ Dekatkan bibir ke mic lalu hembuskan nafas/tiup sekuatnya...'}
                      </p>
                    </div>
                  )}

                  {!isListeningMic && micStatusText && (
                    <p className="mic-status-text" style={{ marginTop: '0.5rem' }}>
                      {micStatusText}
                    </p>
                  )}
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
                        <span>Light the Candles Again</span>
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
              <span className="dock-mini-title" title={PLAYLIST[currentTrackIndex].title}>
                {PLAYLIST[currentTrackIndex].title}
              </span>
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
                <span className="track-label">
                  <i className="fa-solid fa-music" />
                  LAGU KITA
                </span>
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
              <span className="track-title" title={PLAYLIST[currentTrackIndex].title}>
                {PLAYLIST[currentTrackIndex].title}
              </span>
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
