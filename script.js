// Slideshow Navigation System
let currentSection = 0;
const sections = document.querySelectorAll('.section');
const totalSections = sections.length;
let isScrolling = false;

function showSection(index) {
  if (index < 0 || index >= totalSections || isScrolling) return;

  isScrolling = true;

  sections.forEach(section => {
    section.classList.remove('active', 'prev');
  });

  if (index > currentSection) {
    sections[currentSection].classList.add('prev');
  }

  sections[index].classList.add('active');
  currentSection = index;

  const canvas = document.querySelector('#webgl');
  if (index === 0) {
    canvas.style.display = 'block';
  } else {
    canvas.style.display = 'none';
  }

  setTimeout(() => {
    isScrolling = false;
  }, 800);
}

function nextSection() {
  if (currentSection < totalSections - 1) {
    showSection(currentSection + 1);
  }
}

function prevSection() {
  if (currentSection > 0) {
    showSection(currentSection - 1);
  }
}

let scrollTimeout;
function handleScroll(event) {
  if (isScrolling) return;

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const delta = event.deltaY || event.detail || event.wheelDelta;
    if (delta > 0) {
      nextSection();
    } else {
      prevSection();
    }
  }, 50);
}

let touchStartY = 0;
let touchEndY = 0;

function handleTouchStart(event) {
  touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
  touchEndY = event.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;

  if (Math.abs(deltaY) > 50) {
    if (deltaY > 0) {
      nextSection();
    } else {
      prevSection();
    }
  }
}

function setupArrowButtons() {
  const arrowButtons = document.querySelectorAll('.scroll-down-btn');
  arrowButtons.forEach(button => {
    button.addEventListener('click', nextSection);
  });
}

function setupNavigation() {
  // Nav links use data-section attribute for explicit section targeting
  const navLinks = document.querySelectorAll('nav ul li a[data-section]');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = parseInt(link.getAttribute('data-section'));
      if (!isNaN(targetSection)) {
        showSection(targetSection);
      }
    });
  });

  // Navbar brand → section 0 (hero)
  const brand = document.querySelector('.navbar-brand[data-section]');
  if (brand) {
    brand.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(0);
    });
  }
}

window.addEventListener('wheel', handleScroll, { passive: false });
window.addEventListener('touchstart', handleTouchStart, { passive: false });
window.addEventListener('touchend', handleTouchEnd, { passive: false });

window.addEventListener('scroll', (e) => {
  e.preventDefault();
  window.scrollTo(0, 0);
}, { passive: false });

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' || event.key === ' ') {
    event.preventDefault();
    nextSection();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    prevSection();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setupArrowButtons();
  setupNavigation();
  showSection(0);
});

// ─────────────────────────────────────────────────────────
// Three.js Scene
// ─────────────────────────────────────────────────────────

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 24;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#webgl"),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ─────────────────────────────────────────────────────────
// Sphere Data
// ─────────────────────────────────────────────────────────

const radii = [
  1, 0.6, 0.8, 0.4, 0.9, 0.7, 0.9, 0.3, 0.2, 0.5,
  0.6, 0.4, 0.5, 0.6, 0.7, 0.3, 0.4, 0.8, 0.7, 0.5,
  0.4, 0.6, 0.35, 0.38, 0.9,
  0.3, 0.6, 0.4, 0.2, 0.35, 0.5, 0.15, 0.2, 0.25, 0.4,
  0.8, 0.76, 0.8, 1, 0.8, 0.7, 0.8, 0.3, 0.5, 0.6,
  0.55, 0.42, 0.75, 0.66, 0.6, 0.7, 0.5, 0.6, 0.35, 0.35,
  0.35, 0.8, 0.6, 0.7, 0.8, 0.4, 0.89, 0.3,
  0.3, 0.6, 0.4, 0.2, 0.52, 0.5, 0.15, 0.2, 0.25, 0.4,
  0.8, 0.76, 0.8, 1, 0.8, 0.7, 0.8, 0.3, 0.5, 0.6,
  0.8, 0.7, 0.75, 0.66, 0.6, 0.7, 0.5, 0.6, 0.35, 0.35,
  0.35, 0.8, 0.6, 0.7, 0.8, 0.4, 0.89, 0.3
];

const positions = [
  { x: 0, y: 0, z: 0 },
  { x: 1.2, y: 0.9, z: -0.5 },
  { x: 1.8, y: -0.3, z: 0 },
  { x: -1, y: -1, z: 0 },
  { x: -1, y: 1.62, z: 0 },
  { x: -1.65, y: 0, z: -0.4 },
  { x: -2.13, y: -1.54, z: -0.4 },
  { x: 0.8, y: 0.94, z: 0.3 },
  { x: 0.5, y: -1, z: 1.2 },
  { x: -0.16, y: -1.2, z: 0.9 },
  { x: 1.5, y: 1.2, z: 0.8 },
  { x: 0.5, y: -1.58, z: 1.4 },
  { x: -1.5, y: 1, z: 1.15 },
  { x: -1.5, y: -1.5, z: 0.99 },
  { x: -1.5, y: -1.5, z: -1.9 },
  { x: 1.85, y: 0.8, z: 0.05 },
  { x: 1.5, y: -1.2, z: -0.75 },
  { x: 0.9, y: -1.62, z: 0.22 },
  { x: 0.45, y: 2, z: 0.65 },
  { x: 2.5, y: 1.22, z: -0.2 },
  { x: 2.35, y: 0.7, z: 0.55 },
  { x: -1.8, y: -0.35, z: 0.85 },
  { x: -1.02, y: 0.2, z: 0.9 },
  { x: 0.2, y: 1, z: 1 },
  { x: -2.88, y: 0.7, z: 1 },
  { x: -2, y: -0.95, z: 1.5 },
  { x: -2.3, y: 2.4, z: -0.1 },
  { x: -2.5, y: 1.9, z: 1.2 },
  { x: -1.8, y: 0.37, z: 1.2 },
  { x: -2.4, y: 1.42, z: 0.05 },
  { x: -2.72, y: -0.9, z: 1.1 },
  { x: -1.8, y: -1.34, z: 1.67 },
  { x: -1.6, y: 1.66, z: 0.91 },
  { x: -2.8, y: 1.58, z: 1.69 },
  { x: -2.97, y: 2.3, z: 0.65 },
  { x: 1.1, y: -0.2, z: -1.45 },
  { x: -4, y: 1.78, z: 0.38 },
  { x: 0.12, y: 1.4, z: -1.29 },
  { x: -1.64, y: 1.4, z: -1.79 },
  { x: -3.5, y: -0.58, z: 0.1 },
  { x: -0.1, y: -1, z: -2 },
  { x: -4.5, y: 0.55, z: -0.5 },
  { x: -3.87, y: 0, z: 1 },
  { x: -4.6, y: -0.1, z: 0.65 },
  { x: -3, y: 1.5, z: -0.7 },
  { x: -0.5, y: 0.2, z: -1.5 },
  { x: -1.3, y: -0.45, z: -1.5 },
  { x: -3.35, y: 0.25, z: -1.5 },
  { x: -4.76, y: -1.26, z: 0.4 },
  { x: -4.32, y: 0.85, z: 1.4 },
  { x: -3.5, y: -1.82, z: 0.9 },
  { x: -3.6, y: -0.6, z: 1.46 },
  { x: -4.55, y: -1.5, z: 1.63 },
  { x: -3.8, y: -1.15, z: 2.1 },
  { x: -2.9, y: -0.25, z: 1.86 },
  { x: -2.2, y: -0.4, z: 1.86 },
  { x: -5.1, y: -0.24, z: 1.86 },
  { x: -5.27, y: 1.24, z: 0.76 },
  { x: -5.27, y: 2, z: -0.4 },
  { x: -6.4, y: 0.4, z: 1 },
  { x: -5.15, y: 0.95, z: 2 },
  { x: -6.2, y: 0.5, z: -0.8 },
  { x: -4, y: 0.08, z: 1.8 },
  { x: 2, y: -0.95, z: 1.5 },
  { x: 2.3, y: 2.4, z: -0.1 },
  { x: 2.5, y: 1.9, z: 1.2 },
  { x: 1.8, y: 0.37, z: 1.2 },
  { x: 3.24, y: 0.6, z: 1.05 },
  { x: 2.72, y: -0.9, z: 1.1 },
  { x: 1.8, y: -1.34, z: 1.67 },
  { x: 1.6, y: 1.99, z: 0.91 },
  { x: 2.8, y: 1.58, z: 1.69 },
  { x: 2.97, y: 2.3, z: 0.65 },
  { x: -1.3, y: -0.2, z: -2.5 },
  { x: 4, y: 1.78, z: 0.38 },
  { x: 1.72, y: 1.4, z: -1.29 },
  { x: 2.5, y: -1.2, z: -2 },
  { x: 3.5, y: -0.58, z: 0.1 },
  { x: 0.1, y: 0.4, z: -2.42 },
  { x: 4.5, y: 0.55, z: -0.5 },
  { x: 3.87, y: 0, z: 1 },
  { x: 4.6, y: -0.1, z: 0.65 },
  { x: 3, y: 1.5, z: -0.7 },
  { x: 2.3, y: 0.6, z: -2.6 },
  { x: 4, y: 1.5, z: -1.6 },
  { x: 3.35, y: 0.25, z: -1.5 },
  { x: 4.76, y: -1.26, z: 0.4 },
  { x: 4.32, y: 0.85, z: 1.4 },
  { x: 3.5, y: -1.82, z: 0.9 },
  { x: 3.6, y: -0.6, z: 1.46 },
  { x: 4.55, y: -1.5, z: 1.63 },
  { x: 3.8, y: -1.15, z: 2.1 },
  { x: 2.9, y: -0.25, z: 1.86 },
  { x: 2.2, y: -0.4, z: 1.86 },
  { x: 5.1, y: -0.24, z: 1.86 },
  { x: 5.27, y: 1.24, z: 0.76 },
  { x: 5.27, y: 2, z: -0.4 },
  { x: 6.4, y: 0.4, z: 1 },
  { x: 5.15, y: 0.95, z: 2 },
  { x: 6.2, y: 0.5, z: -0.8 },
  { x: 4, y: 0.08, z: 1.8 }
];

// ─────────────────────────────────────────────────────────
// Scene Objects
// ─────────────────────────────────────────────────────────

const material = new THREE.MeshLambertMaterial({
  color: "#929200",
  emissive: "blue"
});
const group = new THREE.Group();
const spheres = [];

positions.forEach((pos, index) => {
  const radius = radii[index];
  const geometry = new THREE.SphereGeometry(radius, 32, 64);
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(pos.x, pos.y, pos.z);
  sphere.userData = {
    originalPosition: { ...pos },
    radius,
    // Per-sphere orbit parameters for the idle animation
    orbitRadiusX: 0.05 + Math.random() * 0.15,
    orbitRadiusY: 0.03 + Math.random() * 0.12,
    orbitRadiusZ: 0.04 + Math.random() * 0.1,
    orbitSpeed: 0.3 + Math.random() * 0.7,
    orbitPhase: Math.random() * Math.PI * 2,
    orbitTilt: (Math.random() - 0.5) * Math.PI * 0.5,
  };
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  spheres.push(sphere);
  group.add(sphere);
});

scene.add(group);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.52);
spotLight.position.set(14, 24, 30);
spotLight.castShadow = true;
scene.add(spotLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight1.position.set(0, -4, 0);
scene.add(directionalLight1);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tempVector = new THREE.Vector3();
const forces = new Map();

// ─────────────────────────────────────────────────────────
// VORTEX SPIRAL — Loading Animation
// ─────────────────────────────────────────────────────────
//
// Each sphere starts on a wide logarithmic spiral arm, far
// from center. Over ~3s the spiral collapses inward while
// rotating, and spheres blend into their final positions
// during the last 40% of the animation. A scale pop-in
// makes each sphere "materialize" as it begins moving.

const vortexDuration = 3.0;
const vortexMaxRadius = 14;
const vortexRotations = 2.5;
const numArms = 3;

// Debug: track animation completion
const DEBUG_VORTEX = true;
let vortexCompletedCount = 0;
let vortexStartTimestamp = 0;

function initVortexAnimation() {
  const totalSpheres = spheres.length;
  vortexStartTimestamp = performance.now();

  if (DEBUG_VORTEX) console.log(`[Vortex] Starting animation for ${totalSpheres} spheres`);

  spheres.forEach((sphere, i) => {
    const orig = sphere.userData.originalPosition;

    // Assign to a spiral arm
    const arm = i % numArms;
    const armAngle = (arm / numArms) * Math.PI * 2;
    const t = i / totalSpheres; // 0..1

    // Starting position on spiral arm
    const spiralAngle = armAngle + t * Math.PI * 4;
    const spiralR = vortexMaxRadius * (0.3 + t * 0.7);
    const startX = Math.cos(spiralAngle) * spiralR;
    const startY = Math.sin(spiralAngle) * spiralR;
    const startZ = (Math.random() - 0.5) * 3;

    sphere.position.set(startX, startY, startZ);
    sphere.scale.set(0, 0, 0);

    // Stagger: outer spheres start first, inner arrive last
    const delay = (1 - t) * 0.4;

    // Scale pop-in
    gsap.timeline({ delay })
      .to(sphere.scale, {
        duration: 0.3,
        x: 1.2, y: 1.2, z: 1.2,
        ease: "back.out(1.7)",
      })
      .to(sphere.scale, {
        duration: 0.2,
        x: 1, y: 1, z: 1,
        ease: "power2.out",
      }, "-=0.1");

    // Spiral collapse — FIX: linear GSAP easing, we handle curves manually
    const anim = { progress: 0 };
    gsap.to(anim, {
      progress: 1,
      duration: vortexDuration,
      delay: delay,
      ease: "none",  // FIX #1: no double-easing, raw linear progress
      onUpdate: function () {
        const p = anim.progress;

        // Radius shrinks with cubic easing (single easing layer now)
        const radiusDecay = easeInOutCubic(p);
        const currentR = spiralR * (1 - radiusDecay);

        // FIX #2: Dampen rotation speed toward the end
        // Rotation slows down as p approaches 1, preventing tangential "whip"
        const rotationEase = p < 0.7 ? p : 0.7 + (p - 0.7) * 0.3;
        const rotation = spiralAngle + rotationEase * vortexRotations * Math.PI * 2;

        const spiralPosX = Math.cos(rotation) * currentR;
        const spiralPosY = Math.sin(rotation) * currentR;
        const spiralPosZ = startZ * (1 - p);

        // FIX #3: Blend starts earlier (p=0.4) over a wider 60% range
        const blendToTarget = smootherstep(clamp((p - 0.4) / 0.6, 0, 1));

        sphere.position.x = lerp(spiralPosX, orig.x, blendToTarget);
        sphere.position.y = lerp(spiralPosY, orig.y, blendToTarget);
        sphere.position.z = lerp(spiralPosZ, orig.z, blendToTarget);
      },
      onComplete: function () {
        // Snap to exact final position (no float drift)
        sphere.position.set(orig.x, orig.y, orig.z);

        vortexCompletedCount++;
        if (DEBUG_VORTEX && vortexCompletedCount === totalSpheres) {
          const elapsed = ((performance.now() - vortexStartTimestamp) / 1000).toFixed(2);
          console.log(`[Vortex] All ${totalSpheres} spheres completed in ${elapsed}s`);
          console.log(`[Vortex] loadingComplete will fire at ${((vortexDuration + 0.5) * 1000).toFixed(0)}ms`);
        }

        // FIX #4: Immediately enable idle for this sphere (no dead zone)
        sphere.userData.vortexDone = true;
      }
    });
  });
}

// Math helpers
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ─────────────────────────────────────────────────────────
// Load trigger
// ─────────────────────────────────────────────────────────

window.addEventListener("load", () => {
  initVortexAnimation();
  setTimeout(() => {
    setupArrowButtons();
    setupNavigation();
  }, 100);
});

// ─────────────────────────────────────────────────────────
// Text reveal
// ─────────────────────────────────────────────────────────

const hiddenElements = document.querySelectorAll(".hide-text");
const main_txt = document.querySelector(".main-txt");
const mouse_effect = document.querySelector(".mouse-effect");

hiddenElements.forEach((el) => {
  el.style.opacity = "0";
});

let loadingComplete = false;
setTimeout(() => {
  loadingComplete = true;
  hiddenElements.forEach((el) => {
    el.style.opacity = "1";
  });
  main_txt.style.opacity = "0";
  if (DEBUG_VORTEX) console.log(`[Vortex] loadingComplete=true, idle animation starting globally`);
}, (vortexDuration + 0.5) * 1000); // FIX #4b: reduced from +0.8 to +0.5

// ─────────────────────────────────────────────────────────
// Custom cursor
// ─────────────────────────────────────────────────────────

gsap.set(".circle", { xPercent: -50, yPercent: -50 });
gsap.set(".circle-follow", { xPercent: -50, yPercent: -50 });

let xTo = gsap.quickTo(".circle", "x", { duration: 0.6, ease: "power3" }),
  yTo = gsap.quickTo(".circle", "y", { duration: 0.6, ease: "power3" });

let xFollow = gsap.quickTo(".circle-follow", "x", {
    duration: 0.6, ease: "power3"
  }),
  yFollow = gsap.quickTo(".circle-follow", "y", {
    duration: 0.6, ease: "power3"
  });

// ─────────────────────────────────────────────────────────
// Mouse interaction
// ─────────────────────────────────────────────────────────

function onMouseMove(event) {
  if (!loadingComplete) return;

  xTo(event.clientX);
  yTo(event.clientY);
  xFollow(event.clientX);
  yFollow(event.clientY);
  mouse_effect.style.opacity = "1";

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(spheres);

  if (intersects.length > 0) {
    const hoveredSphere = intersects[0].object;
    const force = new THREE.Vector3();
    force
      .subVectors(intersects[0].point, hoveredSphere.position)
      .normalize()
      .multiplyScalar(0.2);
    forces.set(hoveredSphere.uuid, force);
  }
}

// ─────────────────────────────────────────────────────────
// Collision handling
// ─────────────────────────────────────────────────────────

function handleCollisions() {
  for (let i = 0; i < spheres.length; i++) {
    const sphereA = spheres[i];
    const radiusA = sphereA.userData.radius;

    for (let j = i + 1; j < spheres.length; j++) {
      const sphereB = spheres[j];
      const radiusB = sphereB.userData.radius;

      const distance = sphereA.position.distanceTo(sphereB.position);
      const minDistance = (radiusA + radiusB) * 1.2;

      if (distance < minDistance) {
        tempVector.subVectors(sphereB.position, sphereA.position);
        tempVector.normalize();

        const pushStrength = (minDistance - distance) * 0.4;
        sphereA.position.sub(tempVector.multiplyScalar(pushStrength));
        sphereB.position.add(tempVector.multiplyScalar(pushStrength));
      }
    }
  }
}

// ─────────────────────────────────────────────────────────
// ORBITAL DRIFT + RIPPLE PULSES — Idle Animation
// ─────────────────────────────────────────────────────────
//
// Each sphere traces a unique tilted elliptical micro-orbit
// around its home position (instead of flat sin/cos breathing).
//
// Every few seconds a "ripple pulse" emanates from center —
// a Gaussian wavefront that temporarily pushes spheres
// outward, then they spring back.

const rippleSpeed = 3.0;
const rippleInterval = 5.0;
const rippleStrength = 0.4;
const rippleWidth = 2.0;
let lastRippleTime = 0;
let rippleActive = false;
let rippleStartTime = 0;

function animate() {
  requestAnimationFrame(animate);

  const now = Date.now();
  const time = now * 0.001;

  // Ripple pulse trigger (only after global loadingComplete)
  if (loadingComplete) {
    if (time - lastRippleTime > rippleInterval) {
      lastRippleTime = time;
      rippleActive = true;
      rippleStartTime = time;
    }
  }

  const rippleElapsed = time - rippleStartTime;
  const rippleRadius = rippleElapsed * rippleSpeed;
  const rippleFade = Math.max(0, 1 - rippleElapsed / 4.0);

  spheres.forEach((sphere, i) => {
    const ud = sphere.userData;

    // FIX #4c: Each sphere starts idle as soon as ITS vortex is done
    if (!ud.vortexDone) return;

    const orig = ud.originalPosition;

    // ── Orbital drift ──
    const angle = time * ud.orbitSpeed + ud.orbitPhase;
    const tilt = ud.orbitTilt;

    const ox = Math.cos(angle) * ud.orbitRadiusX;
    const rawY = Math.sin(angle) * ud.orbitRadiusY;
    const rawZ = Math.sin(angle * 0.7) * ud.orbitRadiusZ;

    // Tilt the orbit plane around X
    const oy = rawY * Math.cos(tilt) - rawZ * Math.sin(tilt);
    const oz = rawY * Math.sin(tilt) + rawZ * Math.cos(tilt);

    let targetX = orig.x + ox;
    let targetY = orig.y + oy;
    let targetZ = orig.z + oz;

    // ── Ripple displacement ──
    if (rippleActive && rippleFade > 0) {
      const distFromCenter = Math.sqrt(
        orig.x * orig.x + orig.y * orig.y + orig.z * orig.z
      );
      const rippleDelta = distFromCenter - rippleRadius;
      const wavefront = Math.exp(
        -(rippleDelta * rippleDelta) / (rippleWidth * rippleWidth)
      );

      const dirLen = distFromCenter || 1;
      targetX += (orig.x / dirLen) * wavefront * rippleStrength * rippleFade;
      targetY += (orig.y / dirLen) * wavefront * rippleStrength * rippleFade;
      targetZ += (orig.z / dirLen) * wavefront * rippleStrength * rippleFade;
    }

    if (rippleFade <= 0) {
      rippleActive = false;
    }

    // ── Mouse force ──
    const force = forces.get(sphere.uuid);
    if (force) {
      sphere.position.add(force);
      force.multiplyScalar(0.95);
      if (force.length() < 0.01) {
        forces.delete(sphere.uuid);
      }
    }

    // ── Spring toward orbital target ──
    tempVector.set(targetX, targetY, targetZ);
    sphere.position.lerp(tempVector, 0.025);
  });

  // Collisions run whenever any sphere has finished vortex
  handleCollisions();

  renderer.render(scene, camera);
}

window.addEventListener("mousemove", onMouseMove);
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});