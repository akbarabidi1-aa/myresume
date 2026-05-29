const cursor = document.querySelector('.cursor');
const blur = document.querySelector('.cursor-blur');
let mouseX = 0, mouseY = 0, blurX = 0, blurY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
});

function animateBlur(){
    blurX += (mouseX - blurX) * 0.12;
    blurY += (mouseY - blurY) * 0.12;
    blur.style.left = blurX + 'px'; blur.style.top = blurY + 'px';
    requestAnimationFrame(animateBlur);
}
animateBlur();

document.querySelectorAll('a, button, .glass-card, .btn-primary, .btn-secondary').forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

const texts = ['Full Stack Developer', 'AI / ML Engineer', 'Creative UI Designer', 'Modern Web Architect'];
let speed = 100, textIndex = 0, charIndex = 0;
const typingText = document.getElementById('typing-text');

function type(){
    if(charIndex < texts[textIndex].length){
        typingText.innerHTML += texts[textIndex].charAt(charIndex);
        charIndex++; setTimeout(type, speed);
    } else { setTimeout(erase, 1500); }
}

function erase(){
    if(charIndex > 0){
        typingText.innerHTML = texts[textIndex].substring(0, charIndex - 1);
        charIndex--; setTimeout(erase, 40);
    } else { textIndex++; if(textIndex >= texts.length) textIndex = 0; setTimeout(type, 500); }
}
document.addEventListener('DOMContentLoaded', () => setTimeout(type, 1000));

const reveals = document.querySelectorAll('.reveal');
window.addEventListener('scroll', () => {
    reveals.forEach((element) => {
        if(element.getBoundingClientRect().top < window.innerHeight - 120) element.classList.add('active');
    });
});

gsap.registerPlugin(ScrollTrigger);
gsap.to('.spline-wrapper', { scale:1, rotate:3, y:200, scrollTrigger:{ trigger:'body', start:'top top', end:'bottom bottom', scrub:2 } });
gsap.to('.hero-title', { y:120, opacity:0.2, scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:2 } });
gsap.to('.hero-right', { y:-100, scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:2 } });

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if(window.scrollY > 50){ navbar.style.background = 'rgba(2,6,23,0.7)'; navbar.style.borderBottom = '1px solid rgba(255,255,255,0.08)'; }
    else { navbar.style.background = 'rgba(2,6,23,0.35)'; }
});