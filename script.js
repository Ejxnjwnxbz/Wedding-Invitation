// ==========================================
// 1. AUDIO & ENVELOPE OVERLAY SYSTEM (MPEG OPTIMIZED)
// ==========================================
const envelopeOverlay = document.getElementById('envelope-overlay');
const bgMusic = document.getElementById('bg-music');

// Force-preload the audio track rules explicitly on render
if (bgMusic) {
    bgMusic.load();
}

if (envelopeOverlay) {
    envelopeOverlay.addEventListener('click', () => {
        // 1. Smoothly fade out and lift the envelope overlay gateway
        envelopeOverlay.style.opacity = '0';
        envelopeOverlay.style.transform = 'translateY(-100vh)';
        
        setTimeout(() => {
            envelopeOverlay.style.display = 'none';
        }, 1000);

        // 2. Play background audio channel (Fixes browser security autoplay blocks)
        if (bgMusic) {
            bgMusic.volume = 1.0; // Ensure audio is unmuted and set to full volume
            
            bgMusic.play()
                .then(() => {
                    console.log("MPEG Audio playing successfully.");
                })
                .catch(error => {
                    console.log("Audio play blocked or failed, executing buffer retry:", error);
                    
                    // Fallback: Trigger a secondary delayed retry if the asset stream was slow buffering
                    setTimeout(() => {
                        bgMusic.play().catch(e => console.log("Delayed playback retry failed:", e));
                    }, 150);
                });
        }
    });
}

// Global reusable smooth scroll navigation function
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// 2. INTERACTIVE SAVE-THE-DATE SCRATCH CARD (PAGE 2)
// ==========================================
const canvas = document.getElementById('scratch-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Dynamically size canvas to fit its wrapper cleanly
    function initCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        
        // Fill canvas overlay with premium metallic gold layer
        ctx.fillStyle = '#D4AF37'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add stylized instructions directly over the scratch surface
        ctx.fillStyle = '#ffffff';
        ctx.font = 'italic 14px Cormorant Garamond';
        ctx.textAlign = 'center';
        ctx.fillText('Scratch to Reveal', canvas.width / 2, canvas.height / 2 + 5);
    }

    // Processing scratch strokes (clearing canvas pixels)
    function scratch(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        // Support both desktop mouse and mobile touch inputs seamlessly
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2); // 24px brush radius
        ctx.fill();
        
        checkScratchPercentage();
    }

    // Auto-reveal the content fully once 45% of the mask is removed
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
            
            // Fire festive celebratory confetti drop
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#701D2E', '#BBA15C', '#FCF6BA']
            });
        }
    }

    // Event listeners tying mouse and gesture actions together
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
// 3. LIVE CELEBRATION COUNTDOWN ENGINE (PAGE 4)
// ==========================================
// Targeted Wedding Date: February 10, 2027
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

    // Format metrics with uniform leading double zeroes
    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Optional Secondary Scratch Mask for Countdown Box
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