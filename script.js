// Initialize AOS (Animate On Scroll) - DISABLED to prevent overlapping
// AOS.init({
//     duration: 1000,
//     once: true,
//     offset: 100
// });

// Wheel Configuration
const prizes = [
    { name: "BMW Cap", color: "#0066b1" },
    { name: "Keychain", color: "#004a8f" },
    { name: "T-Shirt", color: "#0066b1" },
    { name: "Water Bottle", color: "#004a8f" },
    { name: "Notebook", color: "#0066b1" },
    { name: "Pen Set", color: "#004a8f" },
    { name: "Sticker Pack", color: "#0066b1" },
    { name: "Lanyard", color: "#004a8f" }
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const modal = document.getElementById('prizeModal');
const prizeText = document.getElementById('prizeText');
const closeModal = document.querySelector('.close-modal');

let isSpinning = false;
let currentRotation = 0;

// Draw Wheel
function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    prizes.forEach((prize, index) => {
        const startAngle = index * sliceAngle + currentRotation;
        const endAngle = startAngle + sliceAngle;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = prize.color;
        ctx.fill();

        // Draw border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(prize.name, radius / 1.5, 10);
        ctx.restore();
    });

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.stroke();
}

// Initial draw
drawWheel();

// Spin Wheel Function
function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinButton.disabled = true;
    spinButton.textContent = 'SPINNING...';

    // Random spins (5-10 full rotations plus random angle)
    const minSpins = 5;
    const maxSpins = 10;
    const spins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    const randomAngle = Math.random() * 2 * Math.PI;
    const totalRotation = spins * 2 * Math.PI + randomAngle;

    const duration = 4000; // 4 seconds
    const startTime = Date.now();
    const startRotation = currentRotation;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + totalRotation * easeOut;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Normalize rotation
            currentRotation = currentRotation % (2 * Math.PI);
            
            // Calculate winning prize
            const sliceAngle = (2 * Math.PI) / prizes.length;
            // Add PI/2 to align with top pointer
            const adjustedRotation = (currentRotation + Math.PI / 2) % (2 * Math.PI);
            const winningIndex = Math.floor((2 * Math.PI - adjustedRotation) / sliceAngle) % prizes.length;
            
            setTimeout(() => {
                showPrize(prizes[winningIndex].name);
                isSpinning = false;
                spinButton.disabled = false;
                spinButton.textContent = 'SPIN';
            }, 500);
        }
    }

    animate();
}

// Show Prize Modal
function showPrize(prize) {
    prizeText.textContent = `You won: ${prize}!`;
    modal.style.display = 'block';
    
    // Confetti effect
    createConfetti();
}

// Close Modal
closeModal.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Event Listeners
spinButton.addEventListener('click', spinWheel);

// Stats Counter Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = current.toFixed(target % 1 === 0 ? 0 : 1);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target.toFixed(target % 1 === 0 ? 0 : 1);
                if (target % 1 === 0 && target > 100) {
                    stat.textContent = target + '+';
                }
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat.parentElement);
    });
}

animateStats();

// Confetti Effect
function createConfetti() {
    const colors = ['#0066b1', '#004a8f', '#fff', '#ccc'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.transition = 'all 3s ease-out';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.top = window.innerHeight + 'px';
            confetti.style.left = (parseFloat(confetti.style.left) + (Math.random() - 0.5) * 200) + 'px';
            confetti.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax Effect on Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Responsive Canvas Size
function resizeCanvas() {
    const container = document.querySelector('.wheel-container');
    const size = Math.min(container.offsetWidth, 500);
    canvas.width = size;
    canvas.height = size;
    drawWheel();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();