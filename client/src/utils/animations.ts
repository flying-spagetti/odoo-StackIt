import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Fade in animation
export const fadeIn = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(element, 
    { opacity: 0, y: 30 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8,
      ease: "power2.out",
      ...options 
    }
  );
};

// Fade in with scroll trigger
export const fadeInOnScroll = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      ...options
    }
  );
};

// Scale in animation
export const scaleIn = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(element,
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      ...options
    }
  );
};

// Slide in from left
export const slideInLeft = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(element,
    { x: -100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      ...options
    }
  );
};

// Slide in from right
export const slideInRight = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(element,
    { x: 100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      ...options
    }
  );
};

// Stagger animation for multiple elements
export const staggerIn = (elements: string | Element[], options?: gsap.TweenVars) => {
  return gsap.fromTo(elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
      ...options
    }
  );
};

// Hover animations
export const hoverScale = (element: string | Element) => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  el.addEventListener('mouseenter', () => {
    gsap.to(el, { scale: 1.05, duration: 0.3, ease: "power2.out" });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
  });
};

// Loading animation
export const loadingPulse = (element: string | Element) => {
  return gsap.to(element, {
    opacity: 0.5,
    duration: 1,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1
  });
};

// Page transition
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeInOut" }
};

// Card hover effect
export const cardHover = (element: string | Element) => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  el.addEventListener('mouseenter', () => {
    gsap.to(el, { 
      y: -8, 
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      duration: 0.3, 
      ease: "power2.out" 
    });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, { 
      y: 0, 
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      duration: 0.3, 
      ease: "power2.out" 
    });
  });
};

// Notification slide in
export const notificationSlide = (element: string | Element) => {
  return gsap.fromTo(element,
    { x: 400, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    }
  );
};

// Progress bar animation
export const progressBar = (element: string | Element, progress: number) => {
  return gsap.to(element, {
    width: `${progress}%`,
    duration: 1,
    ease: "power2.out"
  });
};

// Typing effect
export const typeWriter = (element: string | Element, text: string, speed: number = 0.05) => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  const tl = gsap.timeline();
  
  tl.to(el, {
    duration: text.length * speed,
    text: text,
    ease: "none"
  });

  return tl;
};
