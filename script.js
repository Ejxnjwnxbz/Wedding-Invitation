// Register scroll mechanics natively
gsap.registerPlugin(ScrollTrigger);

let confettiTriggered = false;
let countdownScratched = false;

window.addEventListener('DOMContentLoaded', () => {
    initScratchCard();
    initCountdownScratch();
});

// 1. ENVELOPE UNPACKING TIMELINE & STAGGERED INTROS
document.getElementById('envelope-overlay').addEventListener('click', function() {
    let tl = gsap.timeline();
    
    // Play audio safely on user interaction click
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.play().catch(e => console.log("Audio play postponed until navigation interaction."));
    }
    
    tl.to(".envelope-container", { scale: 0.95, duration: 0.1 })
      .to(".envelope-container", { scale: 1.4, opacity: 0, duration: 0.4, ease: "power2.inOut" })
      .to("#envelope-overlay", { opacity: 0, display: "none", duration: 0.4 })
      .to("#main-invite", { opacity: 1, duration: 0.1 }, "-=0.4")
      
      // Welcome Page Cascade Entry Animations
      .from(".welcome-page .together-text", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" })
      .from(".welcome-page .couple-name, .welcome-page .parent-info, .welcome-page .with-separator", { 
          opacity: 0, 
          y: 30, 
          duration: 0.8, 
          stagger: 0.15,
          ease: "power2.out" 
      }, "-=0.3")
      .from(".welcome-page .quote", { opacity: 0, y: 20, duration: 0.7, ease: "power2.out" }, "-=0.4")
      .from(".welcome-page .pill-badge", { opacity: 0, scale: 0.9, y: 15, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.3")
      .from(".welcome-page .diya", { opacity: 0, scale: 0.5, duration: 0.8, stagger: 0.2, ease: "back.out(1.5)" }, "-=0.5")
      .from(".welcome-page .scroll-arrow", { opacity: 0, duration: 0.5 }, "-=0.2");
      
    setupScrollTriggers();
});

// 2. SCROLL TRIGGER ANCHOR CONTROLS
function setupScrollTriggers() {
    gsap.from(".scratch-page .content-wrapper > *", {
        scrollTrigger: {
            trigger: ".scratch-page",
            start: "top 75%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out"
    });

    gsap.utils.toArray(".story-page .timeline-item").forEach((item) => {
        gsap.fromTo(item, 
            { opacity: 0, y: 50 },
            {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%", 
                    toggleActions: "play none none none"
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out"
            }
        );
    });

    gsap.from(".countdown-page .countdown-frame", {
        scrollTrigger: {
            trigger: ".countdown-page",
            start: "top 75%"
        },
        opacity: 0,
        scale: 0.96,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
    });

    gsap.from(".events-page .event-card", {
        scrollTrigger: {
            trigger: ".events-page",
            start: "top 75%"
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out"
    });
}

// 3. CANVAS SCRATCH TRACK CORES (PAGE 2)
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 240;
    canvas.height = 85;
    
    const goldGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    goldGrad.addColorStop(0, '#BF953F');
    goldGrad.addColorStop(0.25, '#FCF6BA');
    goldGrad.addColorStop(0.5, '#B38728');
    goldGrad.addColorStop(0.75, '#FBF5B7');
    goldGrad.addColorStop(1, '#AA771C');
    
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#5c4314';
    ctx.font = 'italic 13px Cormorant Garamond';
    ctx.textAlign = 'center';
    ctx.fillText('Swipe the gold to unveil magic ✨', canvas.width / 2, canvas.height / 2 + 4);

    let isDrawing = false;

    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const x = ((clientX - rect.left) / rect.width) * canvas.width;
        const y = ((clientY - rect.top) / rect.height) * canvas.height;
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2); 
        ctx.fill();
        
        checkScratchPercentage();
    }

    function checkScratchPercentage() {
        if (confettiTriggered) return;
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        let clearPixels = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) clearPixels++;
        }
        const percentageCleared = (clearPixels / (canvas.width * canvas.height)) * 100;

        if (percentageCleared > 40) {
            confettiTriggered = true;
            gsap.to(canvas, { opacity: 0, duration: 0.3, onComplete: () => canvas.style.display = 'none' });
            gsap.timeline()
                .to(".save-the-date-box", { scale: 1.06, boxShadow: "0 20px 50px rgba(112, 29, 46, 0.15)", duration: 0.3, ease: "power2.out" })
                .to(".save-the-date-box", { scale: 1, boxShadow: "0 15px 40px rgba(112, 29, 46, 0.04)", duration: 0.4, ease: "elastic.out(1, 0.6)" });
            triggerCelebrationConfetti();
        }
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    window.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', () => isDrawing = true);
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
}

// 4. THEMED COUNTDOWN SCRATCH AREA CARDS MECHANICS (PAGE 4)
function initCountdownScratch() {
    const canvas = document.getElementById('countdown-canvas');
    const ctx = canvas.getContext('2d');
    const innerContainer = canvas.parentElement;

    // Dynamically lock proportions matching outer frame containers
    canvas.width = innerContainer.offsetWidth || 380;
    canvas.height = innerContainer.offsetHeight || 100;

    const goldGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    goldGrad.addColorStop(0, '#BF953F');
    goldGrad.addColorStop(0.3, '#FCF6BA');
    goldGrad.addColorStop(0.5, '#B38728');
    goldGrad.addColorStop(0.7, '#FBF5B7');
    goldGrad.addColorStop(1, '#AA771C');

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#701D2E';
    ctx.font = '500 12px Cormorant Garamond';
    ctx.textAlign = 'center';
    ctx.letterSpacing = "2px";
    ctx.fillText('✨ SCRATCH TO REVEAL ✨', canvas.width / 2, canvas.height / 2 + 4);

    let isDrawing = false;

    function scratch(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = ((clientX - rect.left) / rect.width) * canvas.width;
        const y = ((clientY - rect.top) / rect.height) * canvas.height;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();

        checkCountdownScratchPercentage();
    }

    function checkCountdownScratchPercentage() {
        if (countdownScratched) return;
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        let cleared = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) cleared++;
        }
        if ((cleared / (canvas.width * canvas.height)) * 100 > 40) {
            countdownScratched = true;
            // Graceful fade out animation directly matching Page 2 behavior mechanics
            gsap.to(canvas, { opacity: 0, duration: 0.3, onComplete: () => canvas.style.display = 'none' });
            
            // Trigger the celebration confetti shower right here!
            triggerCelebrationConfetti();
        }
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    window.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', () => isDrawing = true);
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
}

// 5. THEMED CLASSIC CELEBRATION CONFETTI SHOWER ENGINE
function triggerCelebrationConfetti() {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 28, spread: 360, ticks: 50, zIndex: 1000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 40 * (timeLeft / duration);
        
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#BF953F', '#701D2E', '#FCF6BA']
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#BF953F', '#701D2E', '#FCF6BA']
        }));
    }, 250);
}

// 6. TICKING COUNTDOWN CLOCK INTERNALS
const targetDate = new Date("February 10, 2027 00:00:00").getTime();

const countdownInterval = setInterval(function() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

    if (difference < 0) {
        clearInterval(countdownInterval);
        document.querySelector(".countdown-frame").innerHTML = "<h2 class='countdown-title'>The Celebration Has Begun!</h2>";
    }
}, 1000);