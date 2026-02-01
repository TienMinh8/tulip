document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('petals-container'); // Using same container

    // Wind Effect Configuration
    function createWindGust() {
        const isSwirl = Math.random() > 0.6; // 40% chance of swirl, 60% chance of normal lines

        if (isSwirl) {
            createSwirlWind();
        } else {
            createLinearWind();
        }
    }

    function createSwirlWind() {
        // Create 1-2 swirling particles
        const count = Math.floor(Math.random() * 2) + 1;

        for (let i = 0; i < count; i++) {
            const swirl = document.createElement('div');
            swirl.classList.add('wind-swirl');

            // Random start height
            const startY = Math.random() * 60 + 20; // Middle 60% of screen
            swirl.style.top = `${startY}%`;

            // Random duration
            const duration = Math.random() * 2 + 4; // 4-6s
            swirl.style.animationDuration = `${duration}s`;

            container.appendChild(swirl);

            setTimeout(() => {
                swirl.remove();
            }, duration * 1000);
        }
    }

    function createLinearWind() {
        // Create a 'gust' of 3-6 lines
        const lineCount = Math.floor(Math.random() * 4) + 3;

        // Random starting vertical section for this gust (top, middle, bottom)
        const startY = Math.random() * 80 + 10; // 10% to 90% view height

        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.classList.add('wind-line');

            // Randomize properties for each line in the gust
            const width = Math.random() * 150 + 50; // Length 50px-200px
            const topOffset = (Math.random() * 20 - 10); // Spread vertically by +/- 10%
            const duration = Math.random() * 2 + 3; // 3-5s speed
            const delay = Math.random() * 0.5; // Slight stagger

            line.style.width = `${width}px`;
            line.style.top = `${startY + topOffset}%`;
            line.style.animationDuration = `${duration}s`;
            line.style.animationDelay = `${delay}s`;

            container.appendChild(line);

            // Cleanup
            setTimeout(() => {
                line.remove();
            }, (duration + delay) * 1000);
        }
    }

    // Garden Generation
    function createDenseGarden() {
        const gardenContainer = document.getElementById('garden-container');
        const patchCount = 35;

        // Create an array of positions to ensure even spread
        // We'll divide screen into segments to ensure coverage
        const positions = [];
        for (let i = 0; i < patchCount; i++) {
            // Distribute across -10% to 110%
            // This ensures we don't just randomly get a bunch on the right
            const basePos = (i / patchCount) * 120 - 10;
            const jitter = Math.random() * 5 - 2.5; // Slight randomization +/- 2.5%
            positions.push(basePos + jitter);
        }

        // Shuffle positions so big/small flowers are mixed, OR keep sorted and randomize depth?
        // Let's randomize depth completely independently.
        // And shuffle the DOM append order or z-index so we don't have "left is back, right is front" artifact.

        // Actually, let's just loop and pick from positions
        // We shuffle positions array to avoid any correlation if we iterate linearly
        positions.sort(() => Math.random() - 0.5);

        // Texture options for colorful garden
        const textures = [
            'foreground_flowers.png',
            'tulip_red.png',
            'tulip_yellow.png'
        ];

        for (let i = 0; i < patchCount; i++) {
            const patch = document.createElement('div');
            patch.classList.add('flower-patch');

            // Random Texture
            const randomTexture = textures[Math.floor(Math.random() * textures.length)];
            patch.style.backgroundImage = `url('${randomTexture}')`;

            // 1. Depth (0 = far back, 1 = very close)
            const depth = Math.random();

            // Z-Index: 1 to 10 based on depth
            const zIndex = Math.floor(depth * 10) + 1;

            // Size
            const height = 30 + (depth * 30);

            // Brightness/Blur
            const brightness = 0.6 + (depth * 0.6);
            const blur = (1 - depth) * 2;

            // Position - Pick one from our evenly distributed list
            const left = positions[i];
            const width = 30 + (Math.random() * 30);

            // Animation
            const duration = 4 + (Math.random() * 4);
            const swayAmount = 0.5 + (depth * 1);

            // Apply Styles
            patch.style.zIndex = zIndex;
            patch.style.left = `${left}%`;
            patch.style.width = `${width}%`;
            patch.style.height = `${height}vh`;
            patch.style.filter = `brightness(${brightness}) blur(${blur}px)`;

            patch.style.setProperty('--sway-duration', `${duration}s`);
            patch.style.setProperty('--final-opacity', `${0.8 + (depth * 0.2)}`);
            patch.style.setProperty('--sway-start', `${-swayAmount}deg`);
            patch.style.setProperty('--sway-end', `${swayAmount}deg`);

            // Staggered layout
            patch.style.bottom = `${(depth * -15) - 5}%`;

            gardenContainer.appendChild(patch);
        }
    }

    // Special Interactive Flower
    function createSpecialFlower() {
        const gardenContainer = document.getElementById('garden-container');

        const flower = document.createElement('div');
        flower.classList.add('special-flower');

        // Add Click Hint
        const hint = document.createElement('div');
        hint.classList.add('click-hint');
        hint.innerHTML = `
            <span>Click Me</span>
            <div class="arrow-icon"></div>
        `;
        flower.appendChild(hint);

        // Click Event
        // Audio Implementation
        const audio = new Audio('music.mp3');
        audio.loop = true;
        audio.volume = 0.5; // 50% volume

        // Try to autoplay immediately
        audio.play().catch(() => {
            console.log("Autoplay blocked by browser. Waiting for interaction.");
        });

        // Unlock audio on ANY first click (browser policy workaround)
        document.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
            }
        }, { once: true });

        // Click Event
        flower.addEventListener('click', () => {
            // Redundant play call just in case
            if (audio.paused) audio.play();

            // Show Card Container using Flexbox for centering
            const cardContainer = document.querySelector('.card-container');
            cardContainer.style.display = 'flex';
            cardContainer.style.justifyContent = 'center';
            cardContainer.style.alignItems = 'center';

            const card = document.querySelector('.card');

            // Allow reflow/reset
            card.classList.remove('visible');
            void card.offsetWidth; // Force reflow

            // Trigger Animation
            card.classList.add('visible');

            // Hide Hint
            hint.style.opacity = '0';
            setTimeout(() => hint.remove(), 500);
        });

        gardenContainer.appendChild(flower);
    }

    // Launch gusts periodically
    setInterval(() => {
        if (document.hidden) return;
        createWindGust();
    }, 4000);

    // Initial setups
    createWindGust();
    createDenseGarden();
    createSpecialFlower();
});
