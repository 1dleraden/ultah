'use client';

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import './InfiniteSpiral.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min, max, value) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};

const InfiniteSpiral = forwardRef((props, ref) => {
  const {
    items = [],
    speed = 0.45,
    direction = 'up',
    animationMode = 'auto',
    radius = 160,
    cardWidth = 95,
    cardHeight = 95,
    verticalSpacing = 0,
    perspective = 1000,
    cardsPerTurn = 6,
    rotation = 0,
    cardTilt = 0,
    cardRadius = 12,
    centerScale = 1.2,
    edgeFade = 0.35,
    edgeBlur = 0,
    pauseOnHover = true,
    imageFit = 'cover',
    grayscale = 0,
    className = '',
    onCardClick
  } = props;

  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const autoSpeedRef = useRef(0);
  const hoveredRef = useRef(false);
  const isPausedRef = useRef(false);
  const visibleRef = useRef(true);
  const draggingRef = useRef(false);
  const lastPointerYRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const dragMovedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    next: () => {
      targetProgressRef.current += 1;
    },
    prev: () => {
      targetProgressRef.current -= 1;
    },
    togglePause: () => {
      isPausedRef.current = !isPausedRef.current;
      return isPausedRef.current;
    },
    isPaused: () => isPausedRef.current,
    setProgress: (p) => {
      targetProgressRef.current = p;
    }
  }));

  const normalizedItems = useMemo(
    () =>
      items.map((item, index) =>
        typeof item === 'string'
          ? { src: item, alt: `Spiral photo ${index + 1}` }
          : { alt: `Spiral photo ${index + 1}`, ...item }
      ),
    [items]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || normalizedItems.length === 0) return;

    let frameId;
    let previousTime = performance.now();
    let bounds = root.getBoundingClientRect();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const scrollEnabled = animationMode === 'scroll' || animationMode === 'all';
    const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55;
    let lastScrollY = window.scrollY;

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(root);

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const scrollDelta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;
      if (!scrollEnabled || !visibleRef.current || scrollDelta === 0) return;
      targetProgressRef.current += clamp(
        (scrollDelta * scrollSpeedMultiplier) / Math.max(verticalSpacing * 2 || 120, 1),
        -1.2,
        1.2
      );
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = (time) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const autoEnabled = animationMode === 'auto' || animationMode === 'all';
      const motionPaused = isPausedRef.current || draggingRef.current || (pauseOnHover && hoveredRef.current);
      const directionMultiplier = direction === 'down' ? -1 : 1;
      const desiredAutoSpeed =
        autoEnabled && visibleRef.current && !reducedMotion.matches && !motionPaused
          ? speed * directionMultiplier
          : 0;
      const speedBlend = 1 - Math.exp(-delta * 7);
      autoSpeedRef.current += (desiredAutoSpeed - autoSpeedRef.current) * speedBlend;
      targetProgressRef.current += autoSpeedRef.current * delta;

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 9));
      progressRef.current += (targetProgressRef.current - progressRef.current) * followBlend;

      const count = normalizedItems.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const fit = Math.min(1, width / (cardWidth * 2.5), height / (cardHeight * 2.2));
      const responsiveRadius = Math.min(radius, Math.max(65, width * 0.32)) * fit;
      const fadeStart = clamp(1 - edgeFade, 0, 0.98);
      const turnSize = Math.max(cardsPerTurn, 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        let offset = index - progressRef.current;
        offset = modulo(offset + half, count) - half;

        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const opacity = 1 - smoothstep(fadeStart, 1, edge);
        const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.5, 1), 1);
        const scale = (1 + (centerScale - 1) * focus);
        const angle = offset * (360 / turnSize) + rotation;
        const angleRadians = (angle * Math.PI) / 180;
        const x = Math.sin(angleRadians) * responsiveRadius;
        const z = Math.cos(angleRadians) * responsiveRadius;

        // Inward 3D tilt: angles flanking cards gracefully inward towards viewer
        const rotY = -clamp(angle * 0.45, -45, 45);
        const yPos = offset * verticalSpacing * fit;
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
        const blur = edgeBlur * smoothstep(0.45, 1, edge);

        card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${yPos.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rotY.toFixed(1)}deg) rotateZ(${cardTilt}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : 'none';
        card.style.zIndex = String(Math.round(depth * 1000));
        card.style.pointerEvents = opacity > 0.35 ? 'auto' : 'none';
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    normalizedItems,
    speed,
    direction,
    animationMode,
    radius,
    perspective,
    cardWidth,
    cardHeight,
    verticalSpacing,
    cardsPerTurn,
    rotation,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    pauseOnHover
  ]);

  const dragEnabled = animationMode === 'drag' || animationMode === 'all';

  const rootStyle = {
    perspective: `${perspective}px`,
    '--infinite-spiral-card-width': `${cardWidth}px`,
    '--infinite-spiral-card-height': `${cardHeight}px`,
    '--infinite-spiral-card-radius': `${cardRadius}px`,
    cursor: dragEnabled ? 'grab' : 'default',
    touchAction: 'pan-y',
    userSelect: dragEnabled ? 'none' : 'auto'
  };

  const stopDragging = (event) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      if (event.currentTarget && event.currentTarget.hasPointerCapture && event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch (_) {}
    if (event.currentTarget && event.currentTarget.style) {
      event.currentTarget.style.cursor = dragEnabled ? 'grab' : 'default';
    }
  };

  return (
    <div
      ref={rootRef}
      className={`infinite-spiral ${className}`.trim()}
      style={rootStyle}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onPointerDown={(event) => {
        // Only allow mouse dragging; let touch scroll page vertically without lock
        if (!dragEnabled || event.pointerType === 'touch' || (event.pointerType === 'mouse' && event.button !== 0)) return;
        draggingRef.current = true;
        dragMovedRef.current = false;
        lastPointerYRef.current = event.clientY;
        lastPointerXRef.current = event.clientX;
        targetProgressRef.current = progressRef.current;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch (_) {}
        event.currentTarget.style.cursor = 'grabbing';
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current) return;
        const deltaX = event.clientX - lastPointerXRef.current;
        const deltaY = event.clientY - lastPointerYRef.current;
        lastPointerXRef.current = event.clientX;
        lastPointerYRef.current = event.clientY;
        const primaryDelta = verticalSpacing > 10 ? -deltaY : -deltaX;
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) dragMovedRef.current = true;
        targetProgressRef.current += primaryDelta / Math.max(radius || 120, 1);
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onClickCapture={(event) => {
        if (!dragMovedRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        dragMovedRef.current = false;
      }}
    >
      <div className="infinite-spiral__stage" role="list" aria-label="Infinite spiral gallery">
        {normalizedItems.map((item, index) => {
          const Card = item.href ? 'a' : 'div';
          return (
            <Card
              key={item.id ?? `${item.src}-${index}`}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="infinite-spiral__item"
              style={{ width: cardWidth, height: cardHeight, borderRadius: cardRadius }}
              href={item.href}
              target={item.target}
              rel={item.target === '_blank' ? 'noreferrer' : undefined}
              role="listitem"
              aria-label={item.label ?? item.alt}
              onClick={() => {
                // If user clicks a card, rotate it towards front focus
                const count = normalizedItems.length;
                const half = count / 2;
                let offset = index - progressRef.current;
                offset = modulo(offset + half, count) - half;
                targetProgressRef.current += offset;
                if (onCardClick) onCardClick(item, index);
              }}
            >
              <img
                className="infinite-spiral__image"
                src={item.src}
                alt={item.alt}
                loading={index < 4 ? 'eager' : 'lazy'}
                draggable={false}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  objectFit: imageFit,
                  filter: `grayscale(${Math.min(1, Math.max(0, grayscale))})`
                }}
              />
              {item.label && (
                <div className="infinite-spiral__badge">
                  <span>{item.label}</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
});

InfiniteSpiral.displayName = 'InfiniteSpiral';

export default InfiniteSpiral;
