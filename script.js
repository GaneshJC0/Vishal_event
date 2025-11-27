// ============================================
// 3D CAR MODEL WITH THREE.JS
// ============================================

import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let scene, camera, renderer, car, controls;
let isCarInitialized = false;

// CONFIGURATION: Set this to true to use FBX file, false to use built-in model
const USE_FBX_MODEL = true;
const FBX_FILE_PATH = 'bmw-x6/source/FINAL_MODEL_16M/FINAL_MODEL_16M.fbx'; // Change this to your FBX file path

function init3DCar() {
    const container = document.getElementById('car3d-container');
    if (!container) return;

    // Get accurate dimensions using getBoundingClientRect (better for mobile)
    const rect = container.getBoundingClientRect();
    const width = rect.width || container.offsetWidth;
    const height = rect.height || container.offsetHeight;

    // Scene setup
    scene = new THREE.Scene();
    // No background - transparent (will use CSS background)
    scene.background = null;

    // Camera setup
    const aspect = width / height;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(5, 2, 8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false
    });
    renderer.setSize(width, height);
    // Limit pixel ratio on mobile to improve performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Shadows disabled for better mobile performance and no ground needed
    renderer.shadowMap.enabled = false;
    // Ensure transparency works
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 5);
    directionalLight1.castShadow = false; // No shadows needed without ground
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x0066b1, 0.5);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0x0066b1, 1, 50);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Ground removed - no ground plane blocking view
    // Ground with reflection removed for better mobile viewing

    // Load car model
    if (USE_FBX_MODEL) {
        loadFBXCar();
    } else {
        createBMWCar();
    }

    // Mouse controls
    setupMouseControls(container);

    // Animation loop
    animate3DCar();

    isCarInitialized = true;
}

// Load FBX Model
function loadFBXCar() {
    const loader = new FBXLoader();
    
    // Show loading message
    const container = document.getElementById('car3d-container');
    if (container) {
        const loadingText = document.createElement('p');
        loadingText.id = 'loading-text';
        loadingText.style.textAlign = 'center';
        loadingText.style.color = '#888';
        loadingText.style.marginTop = '20px';
        loadingText.textContent = 'Loading 3D Model...';
        container.appendChild(loadingText);
    }
    
    console.log('Loading FBX model from:', FBX_FILE_PATH);
    
    loader.load(
        FBX_FILE_PATH,
        function (object) {
            car = object;
            
            // Optimize meshes for mobile
            car.traverse(function (child) {
                if (child.isMesh) {
                    // No shadows needed - better mobile performance
                    child.castShadow = false;
                    child.receiveShadow = false;
                    // Enable smooth shading
                    if (child.material) {
                        child.material.needsUpdate = true;
                    }
                }
            });
            
            // Calculate bounding box to determine scale
            const box = new THREE.Box3().setFromObject(car);
            const size = box.getSize(new THREE.Vector3());
            const maxDimension = Math.max(size.x, size.y, size.z);
            
            // Scale model to fit nicely in view (adjust this multiplier as needed)
            const targetSize = 8; // Target size in units
            const scale = targetSize / maxDimension;
            car.scale.set(scale, scale, scale);
            
            // Center the model
            const center = box.getCenter(new THREE.Vector3());
            car.position.sub(center.multiplyScalar(scale));
            
            // Move model position (adjust Y position - negative values move down)
            car.position.y += 0.5; // Move down a bit (reduced from 1.5)
            
            // Add to scene
            scene.add(car);
            
            // Remove loading text
            const loadingText = document.getElementById('loading-text');
            if (loadingText) {
                loadingText.remove();
            }
            
            console.log('FBX model loaded successfully!');
            console.log('Model size:', size);
            console.log('Applied scale:', scale);
        },
        function (xhr) {
            // Loading progress
            if (xhr.lengthComputable) {
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                console.log('Loading: ' + percentComplete.toFixed(2) + '%');
                const loadingText = document.getElementById('loading-text');
                if (loadingText) {
                    loadingText.textContent = 'Loading 3D Model... ' + percentComplete.toFixed(0) + '%';
                }
            }
        },
        function (error) {
            console.error('Error loading FBX:', error);
            console.log('Error details:', error.message || error);
            console.log('Tried to load from:', FBX_FILE_PATH);
            console.log('Falling back to built-in car model...');
            
            // Remove loading text
            const loadingText = document.getElementById('loading-text');
            if (loadingText) {
                loadingText.remove();
            }
            
            // Fallback to built-in model if FBX fails to load
            createBMWCar();
        }
    );
}

// Built-in BMW Car (fallback)
function createBMWCar() {
    car = new THREE.Group();

    // Car body - main chassis
    const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x0066b1,
        metalness: 0.9,
        roughness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    car.add(body);

    // Car roof/cabin
    const roofGeometry = new THREE.BoxGeometry(2.5, 0.8, 1.8);
    const roof = new THREE.Mesh(roofGeometry, bodyMaterial);
    roof.position.set(-0.2, 1.6, 0);
    roof.castShadow = true;
    car.add(roof);

    // Hood
    const hoodGeometry = new THREE.BoxGeometry(1.5, 0.3, 2);
    const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
    hood.position.set(2.5, 0.8, 0);
    hood.castShadow = true;
    car.add(hood);

    // Windshield
    const windshieldGeometry = new THREE.BoxGeometry(0.1, 0.7, 1.8);
    const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        metalness: 0.9,
        roughness: 0,
        transparent: true,
        opacity: 0.4
    });
    const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
    windshield.position.set(1, 1.6, 0);
    windshield.rotation.z = 0.2;
    car.add(windshield);

    // Rear windshield
    const rearWindshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
    rearWindshield.position.set(-1.2, 1.6, 0);
    rearWindshield.rotation.z = -0.2;
    car.add(rearWindshield);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.7,
        roughness: 0.3
    });

    const wheelPositions = [
        { x: 1.5, z: 1.2 },
        { x: 1.5, z: -1.2 },
        { x: -1.5, z: 1.2 },
        { x: -1.5, z: -1.2 }
    ];

    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos.x, 0.4, pos.z);
        wheel.castShadow = true;
        car.add(wheel);

        // Wheel rims
        const rimGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.32, 32);
        const rimMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 1,
            roughness: 0.1
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.z = Math.PI / 2;
        rim.position.set(pos.x, 0.4, pos.z);
        car.add(rim);
    });

    // Headlights
    const headlightGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.4);
    const headlightMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffcc,
        emissive: 0xffffcc,
        emissiveIntensity: 0.8
    });

    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(3.2, 0.8, 0.7);
    car.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(3.2, 0.8, -0.7);
    car.add(rightHeadlight);

    // BMW Kidney Grille
    const grilleGeometry = new THREE.BoxGeometry(0.05, 0.5, 1.2);
    const grilleMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.8,
        roughness: 0.2
    });
    const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
    grille.position.set(3.25, 0.8, 0);
    car.add(grille);

    // Tail lights
    const taillightGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.3);
    const taillightMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5
    });

    const leftTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
    leftTaillight.position.set(-2.1, 0.8, 0.8);
    car.add(leftTaillight);

    const rightTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
    rightTaillight.position.set(-2.1, 0.8, -0.8);
    car.add(rightTaillight);

    // Side mirrors
    const mirrorGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.2);
    const mirrorMaterial = new THREE.MeshStandardMaterial({
        color: 0x0066b1,
        metalness: 0.9,
        roughness: 0.1
    });

    const leftMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    leftMirror.position.set(1, 1.4, 1.1);
    car.add(leftMirror);

    const rightMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    rightMirror.position.set(1, 1.4, -1.1);
    car.add(rightMirror);

    // Spoiler
    const spoilerGeometry = new THREE.BoxGeometry(1.5, 0.1, 1.9);
    const spoiler = new THREE.Mesh(spoilerGeometry, bodyMaterial);
    spoiler.position.set(-2, 1.3, 0);
    spoiler.rotation.x = -0.1;
    car.add(spoiler);

    // Move model position (adjust Y position - negative values move down)
    car.position.y += 0.5; // Move down a bit (reduced from 1.5)

    scene.add(car);
}

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let carRotation = { x: 0, y: 0 };

function setupMouseControls(container) {
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    container.addEventListener('mousemove', (e) => {
        if (isDragging && car) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            carRotation.y += deltaX * 0.01;
            carRotation.x += deltaY * 0.01;

            carRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, carRotation.x));

            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    // Touch controls
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        previousMousePosition = { x: touch.clientX, y: touch.clientY };
    });

    container.addEventListener('touchmove', (e) => {
        if (isDragging && car) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - previousMousePosition.x;
            const deltaY = touch.clientY - previousMousePosition.y;

            carRotation.y += deltaX * 0.01;
            carRotation.x += deltaY * 0.01;

            carRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, carRotation.x));

            previousMousePosition = { x: touch.clientX, y: touch.clientY };
        }
    });

    container.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Zoom with mouse wheel
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        camera.position.z += e.deltaY * 0.01 * zoomSpeed;
        camera.position.z = Math.max(4, Math.min(15, camera.position.z));
    });
}

function animate3DCar() {
    requestAnimationFrame(animate3DCar);

    if (car) {
        if (!isDragging) {
            carRotation.y += 0.005;
        }
        car.rotation.y = carRotation.y;
        car.rotation.x = carRotation.x * 0.1;
    }

    renderer.render(scene, camera);
}

// Responsive 3D car
function resize3DCar() {
    const container = document.getElementById('car3d-container');
    if (!container || !camera || !renderer) return;

    // Use getBoundingClientRect for more accurate dimensions on mobile
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width > 0 && height > 0) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio on mobile
    }
}

// Handle window resize
window.addEventListener('resize', resize3DCar);

// Handle orientation change on mobile
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        resize3DCar();
    }, 100);
});

// Initialize 3D car when DOM is ready
function init3DCarWhenReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                init3DCar();
                // Resize after initialization to ensure correct dimensions
                setTimeout(() => resize3DCar(), 100);
            }, 100);
        });
    } else {
        setTimeout(() => {
            init3DCar();
            // Resize after initialization to ensure correct dimensions
            setTimeout(() => resize3DCar(), 100);
        }, 100);
    }
}

init3DCarWhenReady();

// ============================================
// WHEEL CONFIGURATION
// ============================================

// Spin wheel prizes: 6 fields, some fields are intentionally blank and others are keychain prizes
// Configure weights so key chains total ~10% probability and blank fields total ~90%
// Each blank slice uses weight 9 and each keychain weight 1 gives total keychain probability 3*1 / (3*9 + 3*1) = 3/30 = 10%
const prizes = [
    { name: "RIP Luck", color: "#0066b1", weight: 9 },
    { name: "Key chain", color: "#004a8f", weight: 1 },
    { name: "Skill Issue", color: "#0066b1", weight: 9 },
    { name: "Key chain", color: "#004a8f", weight: 1 },
    { name: "Too Slow", color: "#0066b1", weight: 9 },
    { name: "Key chain", color: "#004a8f", weight: 1 }
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const modal = document.getElementById('prizeModal');
const prizeTitle = document.getElementById('prizeTitle');
const prizeText = document.getElementById('prizeText');
const closeModal = document.querySelector('.close-modal');
const modalCtaBtn = document.getElementById('modalCtaBtn');

let isSpinning = false;
let currentRotation = 0;
let canvasSize = 500;
const SPIN_USED_KEY = 'wheelHasSpun';

// Draw Wheel
function drawWheel() {
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const radius = canvasSize / 2 - 10;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    prizes.forEach((prize, index) => {
        const startAngle = index * sliceAngle + currentRotation;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = prize.color;
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(prize.name, radius / 1.5, 10);
        ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.stroke();
}

// Check whether this device (browser) has already used the spin
function checkSpinAvailability() {
    try {
        const hasSpun = localStorage.getItem(SPIN_USED_KEY) === 'true';
        if (hasSpun) {
            spinButton.disabled = true;
            spinButton.textContent = 'ALREADY SPUN';
        } else {
            spinButton.disabled = false;
            spinButton.textContent = 'SPIN';
        }
    } catch (err) {
        // localStorage unavailable (e.g., third-party restriction); fallback to enabled
        spinButton.disabled = false;
    }
}

function markAsSpun() {
    try {
        localStorage.setItem(SPIN_USED_KEY, 'true');
    } catch (err) {
        // ignore set errors (e.g., storage disabled)
    }
}

// Helper: select an index with weighted probability
function chooseWeightedIndex(weights) {
    const total = weights.reduce((sum, w) => sum + w, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
        if (rand < weights[i]) return i;
        rand -= weights[i];
    }
    return weights.length - 1;
}

// Utility: simulate weighted distribution count (debug only) - call from console if needed:
function simulateWheelDistribution(iterations = 10000) {
    const weights = prizes.map(p => (typeof p.weight === 'number' ? p.weight : 1));
    const counts = Array(prizes.length).fill(0);
    for (let i = 0; i < iterations; i++) {
        counts[chooseWeightedIndex(weights)]++;
    }
    console.log('Distribution over', iterations, 'iterations:');
    counts.forEach((c, i) => console.log(i, prizes[i].name || '(empty)', c, (c/iterations*100).toFixed(2) + '%'));
}

drawWheel();
// Check localStorage to see if this device already used a spin
checkSpinAvailability();

// Spin Wheel Function
function spinWheel() {
    if (isSpinning) return;
    try {
        if (localStorage.getItem(SPIN_USED_KEY) === 'true') {
            // Already spun on this device; ensure button state is disabled and don't allow a new spin
            spinButton.disabled = true;
            spinButton.textContent = 'ALREADY SPUN';
            return;
        }
    } catch (err) {
        // ignore storage errors and allow spin
    }
    // Mark device as having spun immediately to prevent re-spins across tabs
    markAsSpun();
    
    isSpinning = true;
    spinButton.disabled = true;
    spinButton.textContent = 'SPINNING...';

    const minSpins = 5;
    const maxSpins = 10;
    const spins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;

    // Choose the winning index using weighted selection so empty fields occur more often
    const weights = prizes.map(p => (typeof p.weight === 'number' ? p.weight : 1));
    const winningIndex = chooseWeightedIndex(weights);

    // We will compute a target end rotation that makes the wheel stop on winningIndex
    const sliceAngle = (2 * Math.PI) / prizes.length;
    // adjustedRotation = (finalRotation + PI/2) % (2PI) with winningIndex
    // For winningIndex j, adjustedRotation must be in range [2PI - (j+1)*sliceAngle, 2PI - j*sliceAngle)
    const wedgeStart = 2 * Math.PI - (winningIndex + 1) * sliceAngle;
    const wedgeEnd = wedgeStart + sliceAngle;
    const adjustedRotation = wedgeStart + Math.random() * (wedgeEnd - wedgeStart);
    // finalRotation is adjustedRotation - PI/2 (normalize to 0..2PI)
    let finalRotation = adjustedRotation - Math.PI / 2;
    finalRotation = ((finalRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    const startRotationNormalized = ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let totalRotation = spins * 2 * Math.PI + (finalRotation - startRotationNormalized);
    if (totalRotation < 0) totalRotation += 2 * Math.PI;

    const duration = 4000;
    const startTime = Date.now();
    const startRotation = currentRotation;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + totalRotation * easeOut;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            currentRotation = currentRotation % (2 * Math.PI);
            
            const sliceAngle = (2 * Math.PI) / prizes.length;
            const adjustedRotation = (currentRotation + Math.PI / 2) % (2 * Math.PI);
            // Compute winning index from final rotation (sanity-check); otherwise fallback to our chosen index
            const computedIndex = Math.floor((2 * Math.PI - adjustedRotation) / sliceAngle) % prizes.length;
            
            setTimeout(() => {
                // Normally computedIndex should equal our chosen winningIndex; use our chosen index when available
                const finalWinningIndex = typeof winningIndex !== 'undefined' ? winningIndex : computedIndex;
                showPrize(prizes[finalWinningIndex].name);
                isSpinning = false;
                // Keep the button disabled since user has already spun on this device
                spinButton.disabled = true;
                spinButton.textContent = 'ALREADY SPUN';
            }, 500);
        }
    }

    animate();
}

// Show Prize Modal
function showPrize(prize) {
    // Custom messages based on where the wheel stops
    // Normalize prize for comparisons
    const p = (prize || '').toString().trim().toLowerCase();
    // Default: no title
    if (prizeTitle) prizeTitle.textContent = "";

    // Map specific messages per prize name
    if (!p) {
        prizeText.textContent = "Oops, better luck next time.";
    } else if (p === 'key chain' || p === 'keychain') {
        prizeText.textContent = "Congratulations you won keychain.";
    } else if (p === 'rip luck' || p === 'rip') {
        prizeText.textContent = "Oops no Keychain this time.";
    } else if (p === 'skill issue') {
        prizeText.textContent = "Sorry your keychain escaped";
    } else if (p === 'too slow' || p === 'to slow') {
        prizeText.textContent = "Keychain said catch me if you can";
    } else {
        // Fallback (other prizes)
        prizeText.textContent = `You won: ${prize}!`;
    }
    modal.style.display = 'block';
    // Show or hide the modal CTA button per prize; remove "Spin Again" action for losing results
    if (modalCtaBtn) {
        if (p === 'key chain' || p === 'keychain') {
            modalCtaBtn.style.display = ''; // allow default
            modalCtaBtn.textContent = 'Close';
        } else {
            // Hide the CTA for non-winning results (user shouldn't spin again)
            modalCtaBtn.style.display = 'none';
        }
    }
    // Only show confetti for winning outcome (case-insensitive check)
    if (p === 'key chain' || p === 'keychain') {
        createConfetti();
    }
}

// Close Modal
closeModal.onclick = function() {
    modal.style.display = 'none';
}

// Close modal via CTA button (if visible); do NOT reload (one spin per device enforced)
if (modalCtaBtn) {
    modalCtaBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

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

// Responsive Canvas Size
function resizeCanvas() {
    const container = document.querySelector('.wheel-container');
    if (container) {
        canvasSize = container.offsetWidth;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvasSize * dpr;
        canvas.height = canvasSize * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        canvas.style.width = canvasSize + 'px';
        canvas.style.height = canvasSize + 'px';
        drawWheel();
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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