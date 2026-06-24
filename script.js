// ==========================================
// 1. AUDIO & ENVELOPE OVERLAY SYSTEM (MPEG OPTIMIZED)
// ==========================================
const envelopeOverlay = document.getElementById('envelope-overlay');
const bgMusic = document.getElementById('bg-music');

if (bgMusic) {
    bgMusic.load();
}

if (envelopeOverlay) {
    envelopeOverlay.addEventListener('click', () => {
        envelopeOverlay.style.opacity = '0';
        envelopeOverlay.style.transform = 'translateY(-100vh)';
        
        setTimeout(() => {
            envelopeOverlay.style.display = 'none';
        }, 1000);

        if (bgMusic) {
            bgMusic.volume = 1.0;
            bgMusic.play()
                .then(() => { console.log("MPEG Audio playing successfully."); })
                .catch(error => {
                    console.log("Audio play blocked, attempting buffer retry...", error);
                    setTimeout(() => {
                        bgMusic.play().catch(e => console.log("Delayed playback retry failed:", e));
                    }, 150);
                });
        }
    });
}

function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// 2. INTERACTIVE SAVE-THE-DATE SCRATCH CARD
// ==========================================
const canvas = document.getElementById('scratch-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    function initCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        ctx.fillStyle = '#D4AF37'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'italic 14px Cormorant Garamond';
        ctx.textAlign = 'center';
        ctx.fillText('Scratch to Reveal', canvas.width / 2, canvas.height / 2 + 5);
    }

    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
        checkScratchPercentage();
    }

    function checkScratchPercentage() {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        let cleared = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) cleared++;
        }
        if (cleared / (pixels.length / 4) > 0.45) {
            canvas.style.opacity = '0';
            setTimeout(() => canvas.remove(), 400);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#701D2E', '#BBA15C', '#FCF6BA']
            });
        }
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('touchstart', () => isDrawing = true);
    window.addEventListener('mouseup', () => isDrawing = false);
    window.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch);
    window.addEventListener('load', initCanvas);
    window.addEventListener('resize', initCanvas);
}

// ==========================================
// 3. LIVE CELEBRATION COUNTDOWN ENGINE
// ==========================================
const targetDate = new Date('February 10, 2027 00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference < 0) {
        document.getElementById('countdown-timer').innerHTML = "<p style='color:#FCF6BA; grid-column: span 4; font-size: 24px; font-family: \"Great Vibes\", cursive;'>The Celebration Has Begun!</p>";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Optional Countdown Mask
const countCanvas = document.getElementById('countdown-canvas');
if (countCanvas) {
    const cCtx = countCanvas.getContext('2d');
    let countDrawing = false;

    function initCountCanvas() {
        countCanvas.width = countCanvas.parentElement.offsetWidth;
        countCanvas.height = countCanvas.parentElement.offsetHeight;
        cCtx.fillStyle = '#BBA15C';
        cCtx.fillRect(0, 0, countCanvas.width, countCanvas.height);
        cCtx.fillStyle = '#701D2E';
        cCtx.font = '12px Cormorant Garamond';
        cCtx.textAlign = 'center';
        cCtx.fillText('Reveal Countdown', countCanvas.width / 2, countCanvas.height / 2 + 4);
    }

    function countScratch(e) {
        if (!countDrawing) return;
        const rect = countCanvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        cCtx.globalCompositeOperation = 'destination-out';
        cCtx.beginPath();
        cCtx.arc(x, y, 20, 0, Math.PI * 2);
        cCtx.fill();
        
        const imgData = cCtx.getImageData(0, 0, countCanvas.width, countCanvas.height);
        let cleared = 0;
        for (let i = 3; i < imgData.data.length; i += 4) {
            if (imgData.data[i] === 0) cleared++;
        }
        if (cleared / (imgData.data.length / 4) > 0.4) {
            countCanvas.style.opacity = '0';
            setTimeout(() => countCanvas.remove(), 400);
        }
    }

    countCanvas.addEventListener('mousedown', () => countDrawing = true);
    countCanvas.addEventListener('touchstart', () => countDrawing = true);
    window.addEventListener('mouseup', () => countDrawing = false);
    window.addEventListener('touchend', () => countDrawing = false);
    countCanvas.addEventListener('mousemove', countScratch);
    countCanvas.addEventListener('touchmove', countScratch);
    window.addEventListener('load', initCountCanvas);
    window.addEventListener('resize', initCountCanvas);
}

// ==========================================
// 4. SCROLL REVEAL STIMULUS (GSAP)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Register the scroll plugin with the core GSAP engine
    gsap.registerPlugin(ScrollTrigger);
    
    // Select and animate all target page wrappers smoothly
    gsap.utils.toArray(".scroll-reveal").forEach((element) => {
        gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 82%", // Triggers animation when section enters 82% from top
                toggleActions: "play none none none" // Plays once, locks layout in place
            }
        });
    });
});