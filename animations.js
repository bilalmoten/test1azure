import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
  // Animate testimonials using GSAP
  gsap.from('.testimonial', {
    duration: 1,
    opacity: 0,
    y: 50,
    stagger: 0.3,
    scrollTrigger: {
      trigger: '.testimonial',
      start: 'top bottom-=150',
      toggleActions: 'play none none none',
      onEnter: () => console.log('Testimonial animation triggered'),
      onEnterBack: () => console.log('Testimonial animation triggered on scroll back'),
      onLeave: () => console.log('Testimonial left viewport'),
      onLeaveBack: () => console.log('Testimonial entered viewport from the back')
    }
  });
});