document.addEventListener('DOMContentLoaded', () => {

    // --- 0. PRELOADER CAKE ANIMATION ---
    const preloader = document.getElementById('preloader-cake');
    
    // Simulate baking time, then fade out preloader
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.classList.remove('active');
            preloader.style.display = 'none';
        }, 1000); // Wait for fade out transition
    }, 3000); // 3 seconds of preloader

    
    // --- 1. PASSWORD LOGIC ---
    const passwordScreen = document.getElementById('password-screen');
    const mainContent = document.getElementById('main-content');
    const secretWordInput = document.getElementById('secretWord');
    const submitBtn = document.getElementById('submitBtn');
    const errorMsg = document.getElementById('errorMsg');
    const CORRECT_PASSWORD = "I LOVE U";

    function checkPassword() {
        const value = secretWordInput.value.trim().toUpperCase();
        if (value === CORRECT_PASSWORD) {
            // Success
            passwordScreen.classList.add('fade-bloom');
            setTimeout(() => {
                passwordScreen.classList.remove('active');
                mainContent.classList.remove('hidden');
                // Trigger any animations that need to start after load
                initAnimations();
                
                // Play music automatically after user interaction
                if (!isPlaying) {
                    bgMusic.play().catch(e => console.log("Audio play failed:", e));
                    musicIcon.textContent = '🎶';
                    musicIcon.classList.add('music-playing');
                    isPlaying = true;
                }
            }, 1000);
        } else {
            // Failure
            errorMsg.classList.add('show');
            passwordScreen.querySelector('.password-container').classList.remove('shake');
            // Trigger reflow
            void passwordScreen.offsetWidth;
            passwordScreen.querySelector('.password-container').classList.add('shake');
            setTimeout(() => {
                errorMsg.classList.remove('show');
            }, 2000);
        }
    }

    submitBtn.addEventListener('click', checkPassword);
    secretWordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    // --- 2. PARTICLES BACKGROUND (STARS, BALLOONS, HEARTS) ---
    const particlesContainer = document.getElementById('particles');
    const particleCount = 40;
    const shapes = ['⭐', '🎈', '💖', '✨'];

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle-shape');
        particle.style.position = 'absolute';
        particle.style.opacity = '0.7';
        
        // Random shape
        particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Random size between 15px and 30px
        const size = Math.random() * 15 + 15;
        particle.style.fontSize = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Random animation duration and delay
        const duration = Math.random() * 20 + 10; // 10s to 30s
        const delay = Math.random() * 10;
        
        // Use inline animation keyframes or existing floatParticle
        particle.style.animation = `floatParticle ${duration}s linear infinite ${delay}s, pulseText 3s ease-in-out infinite alternate`;
        
        particlesContainer.appendChild(particle);
        
        // Recreate particle when it floats up
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, (duration + delay) * 1000);
    }

    // --- 3. COUNTDOWN TIMER ---
    const startDateStr = document.getElementById('date-data').getAttribute('data-start-date');
    const startDate = new Date(startDateStr);
    
    function updateCountdown() {
        const now = new Date();
        
        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();

        if (days < 0) {
            months--;
            // Get days in previous month
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Just in case start date is in the future
        if (years < 0) { years = 0; months = 0; days = 0; }

        document.getElementById('count-years').textContent = years;
        document.getElementById('count-months').textContent = months.toString().padStart(2, '0');
        document.getElementById('count-days').textContent = days.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000 * 60 * 60); // Update every hour
    updateCountdown();

    // --- 4. MUSIC CONTROLS ---
    const musicBtn = document.getElementById('musicToggle');
    const prevSongBtn = document.getElementById('prevSongBtn');
    const nextSongBtn = document.getElementById('nextSongBtn');
    const bgMusic = document.getElementById('bgMusic');
    const musicIcon = musicBtn.querySelector('.music-icon');
    let isPlaying = false;
    let currentSongIndex = 0;

    const SONGS = [
        "https://res.cloudinary.com/dtbm1sjoo/video/upload/v1778823933/AQO1pyuBHMQPD1Na-2Uc_uEeH0nzvXbMKlP5UxOHyMzThnUmmMZOzC-nkCpDruJWq7H4aAhfYIkfgwHcHiHeo9y16Z9QSQt-CqPeCxA_h0ofxq.mp3",
        "https://res.cloudinary.com/dtbm1sjoo/video/upload/v1778824307/vidssave.com_The_Love_Bug_Has_Bitten_Background_Score_256kbps_om228u.webm",
        "https://res.cloudinary.com/dtbm1sjoo/video/upload/v1778824803/vidssave.com_Annul_Maelae_Instrumental_256kbps_xvu8fk.webm",
        "https://res.cloudinary.com/dtbm1sjoo/video/upload/v1778085546/ytdown-youtube-the-metro-proposal-media-gttjnsenwdg-009-128k_1OnRlng6_pwyecn.mp3"
    ];

    // Select a random song for this session initially
    currentSongIndex = Math.floor(Math.random() * SONGS.length);
    bgMusic.src = SONGS[currentSongIndex];
    bgMusic.load();

    // Set lower volume for romantic bg music
    bgMusic.volume = 0.3;

    function playMusic() {
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
        musicIcon.textContent = '🎶';
        musicIcon.classList.add('music-playing');
        isPlaying = true;
    }

    function pauseMusic() {
        bgMusic.pause();
        musicIcon.textContent = '🎵';
        musicIcon.classList.remove('music-playing');
        isPlaying = false;
    }

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    function changeSong(direction) {
        if (direction === 'next') {
            currentSongIndex = (currentSongIndex + 1) % SONGS.length;
        } else {
            currentSongIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length;
        }
        bgMusic.src = SONGS[currentSongIndex];
        bgMusic.load();
        if (isPlaying) {
            playMusic();
        }
    }

    if (nextSongBtn) {
        nextSongBtn.addEventListener('click', () => changeSong('next'));
    }
    if (prevSongBtn) {
        prevSongBtn.addEventListener('click', () => changeSong('prev'));
    }

    // --- 5. SCROLL ANIMATIONS (INTERSECTION OBSERVER) ---
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px 50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Trigger typewriter if letter section
                    if (entry.target.id === 'letter' && !entry.target.classList.contains('typed')) {
                        entry.target.classList.add('typed');
                        startTypewriter();
                    }

                    // Trigger confetti if wish section
                    if (entry.target.id === 'wish' && !entry.target.classList.contains('celebrated')) {
                        entry.target.classList.add('celebrated');
                        createConfetti();
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-section').forEach(section => {
            observer.observe(section);
        });

        // Initialize Hero Petals immediately after load
        createPetals();
    }

    // --- 6. TYPEWRITER EFFECT ---
    const textToType = "To the girl who made ordinary days feel like magic — Happy Birthday. You are my moon, my stars, and everything in between. I love you more than words can ever say. 🌙";
    const typewriterElement = document.getElementById('typewriter-text');
    const signature = document.querySelector('.signature');
    
    function startTypewriter() {
        let i = 0;
        typewriterElement.textContent = '';
        
        function typeWriter() {
            if (i < textToType.length) {
                typewriterElement.textContent += textToType.charAt(i);
                i++;
                // Random typing speed for realism
                const speed = Math.random() * 50 + 30; 
                setTimeout(typeWriter, speed);
            } else {
                // Show signature after typing is done
                setTimeout(() => {
                    signature.classList.add('show');
                }, 500);
            }
        }
        typeWriter();
    }

    // --- 7. HERO PETALS ---
    function createPetals() {
        const heroSection = document.getElementById('hero');
        for (let i = 0; i < 15; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            
            // Random size, position, rotation
            const size = Math.random() * 15 + 10;
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            petal.style.left = `${Math.random() * 100}vw`;
            
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            petal.style.animationDuration = `${duration}s`;
            petal.style.animationDelay = `${delay}s`;
            
            heroSection.appendChild(petal);
        }
    }

    // --- 8. WISH CONFETTI ---
    function createConfetti() {
        const wishSection = document.getElementById('wish');
        const colors = ['#c9a96e', '#f4a7b9', '#ffffff', '#ff9900'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const duration = Math.random() * 3 + 2;
            confetti.style.animationDuration = `${duration}s`;
            
            wishSection.appendChild(confetti);
            
            // Cleanup
            setTimeout(() => {
                confetti.remove();
            }, duration * 1000);
        }
    }

    // --- 9. INFINITE CAROUSEL CLONING & SHUFFLING ---
    const carouselTrack = document.getElementById('carousel-track');
    if (carouselTrack) {
        let slides = Array.from(carouselTrack.children);
        
        // Keep the first image fixed as requested, shuffle the rest
        if (slides.length > 1) {
            const firstSlide = slides.shift();
            
            // Shuffle remaining slides (Fisher-Yates)
            for (let i = slides.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [slides[i], slides[j]] = [slides[j], slides[i]];
            }
            
            slides.unshift(firstSlide);
        }
        
        // Re-append to track in shuffled order
        slides.forEach(slide => carouselTrack.appendChild(slide));
        
        // Clone all slides and append them to the track to create the infinite loop effect
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            carouselTrack.appendChild(clone);
        });
    }

    // --- 10. FULLSCREEN SLIDESHOW ---
    const startSlideshowBtn = document.getElementById('start-slideshow-btn');
    const slideshowModal = document.getElementById('slideshow-modal');
    const closeSlideshowBtn = document.getElementById('close-slideshow');
    const downloadSlideBtn = document.getElementById('download-slide');
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');
    const slideshowImage = document.getElementById('slideshow-image');
    
    let slideshowImages = [];
    let currentSlideIndex = 0;

    if (startSlideshowBtn && slideshowModal) {
        let slideshowInterval = null;

        function startAutoSlide() {
            stopAutoSlide();
            slideshowInterval = setInterval(() => {
                currentSlideIndex = (currentSlideIndex + 1) % slideshowImages.length;
                updateSlideshowImage();
            }, 3000);
        }

        function stopAutoSlide() {
            if (slideshowInterval) clearInterval(slideshowInterval);
        }

        startSlideshowBtn.addEventListener('click', () => {
            const allImgElements = document.querySelectorAll('#carousel-track .carousel-slide img');
            // Since we cloned them, let's just get the unique ones by looking at the first half
            const uniqueImages = Array.from(allImgElements).slice(0, allImgElements.length / 2);
            slideshowImages = uniqueImages.map(img => img.src);
            
            if (slideshowImages.length > 0) {
                currentSlideIndex = 0;
                updateSlideshowImage();
                slideshowModal.classList.remove('hidden');
                startAutoSlide();
            }
        });

        if (carouselTrack) {
            carouselTrack.addEventListener('click', (e) => {
                const slide = e.target.closest('.carousel-slide');
                if (slide) {
                    const allImgElements = document.querySelectorAll('#carousel-track .carousel-slide img');
                    const uniqueImages = Array.from(allImgElements).slice(0, allImgElements.length / 2);
                    slideshowImages = uniqueImages.map(img => img.src);
                    
                    const allSlides = Array.from(carouselTrack.children);
                    const clickedIndex = allSlides.indexOf(slide);
                    
                    if (slideshowImages.length > 0) {
                        currentSlideIndex = clickedIndex % uniqueImages.length;
                        updateSlideshowImage();
                        slideshowModal.classList.remove('hidden');
                        startAutoSlide();
                    }
                }
            });
        }

        closeSlideshowBtn.addEventListener('click', () => {
            slideshowModal.classList.add('hidden');
            stopAutoSlide();
        });

        if (downloadSlideBtn) {
            downloadSlideBtn.addEventListener('click', () => {
                const currentSrc = slideshowImages[currentSlideIndex];
                if (currentSrc) {
                    fetch(currentSrc)
                        .then(response => response.blob())
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = 'Our_Memory.png';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                        })
                        .catch(() => {
                            const a = document.createElement('a');
                            a.href = currentSrc;
                            a.download = 'Our_Memory.png';
                            a.target = '_blank';
                            a.click();
                        });
                }
            });
        }

        prevSlideBtn.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex - 1 + slideshowImages.length) % slideshowImages.length;
            updateSlideshowImage();
            startAutoSlide(); // reset timer
        });

        nextSlideBtn.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex + 1) % slideshowImages.length;
            updateSlideshowImage();
            startAutoSlide(); // reset timer
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!slideshowModal.classList.contains('hidden')) {
                if (e.key === 'Escape') {
                    slideshowModal.classList.add('hidden');
                    stopAutoSlide();
                } else if (e.key === 'ArrowLeft') {
                    currentSlideIndex = (currentSlideIndex - 1 + slideshowImages.length) % slideshowImages.length;
                    updateSlideshowImage();
                    startAutoSlide();
                } else if (e.key === 'ArrowRight') {
                    currentSlideIndex = (currentSlideIndex + 1) % slideshowImages.length;
                    updateSlideshowImage();
                    startAutoSlide();
                }
            }
        });

        function updateSlideshowImage() {
            slideshowImage.style.animation = 'none';
            slideshowImage.offsetHeight; // trigger reflow
            slideshowImage.style.animation = null; 
            slideshowImage.src = slideshowImages[currentSlideIndex];
        }
    }

    // --- 11. INTERACTIVE CANDLE ---
    const magicCandle = document.getElementById('magic-candle');
    const magicFlame = document.getElementById('magic-flame');
    if (magicCandle && magicFlame) {
        magicCandle.addEventListener('click', () => {
            magicFlame.classList.toggle('lit');
        });
    }

    // --- 12. SURPRISE GIFT BOX ---
    const nextSurpriseBtn = document.getElementById('next-surprise-btn');
    const surpriseSection = document.getElementById('surprise');
    const magicGiftBox = document.getElementById('magic-gift-box');

    if (nextSurpriseBtn && surpriseSection) {
        nextSurpriseBtn.addEventListener('click', () => {
            surpriseSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                if (magicGiftBox && !magicGiftBox.classList.contains('open')) {
                    magicGiftBox.classList.add('shake');
                }
            }, 800);
        });
    }

    if (magicGiftBox) {
        magicGiftBox.addEventListener('click', () => {
            if (!magicGiftBox.classList.contains('open')) {
                magicGiftBox.classList.remove('shake');
                magicGiftBox.classList.add('open');
                
                // Mini confetti burst
                const colors = ['#ff69b4', '#ffd700', '#ff1493', '#fff'];
                for (let i = 0; i < 30; i++) {
                    const conf = document.createElement('div');
                    conf.style.position = 'absolute';
                    conf.style.width = '8px';
                    conf.style.height = '8px';
                    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    conf.style.left = `50%`;
                    conf.style.top = `50%`;
                    conf.style.zIndex = `20`;
                    
                    const angle = Math.random() * Math.PI * 2;
                    const velocity = Math.random() * 150 + 50;
                    const tx = Math.cos(angle) * velocity;
                    const ty = Math.sin(angle) * velocity - 100;
                    
                    conf.style.transition = 'all 1s cubic-bezier(0.1, 0.8, 0.3, 1)';
                    conf.style.opacity = '1';
                    conf.style.transform = `translate(-50%, -50%)`;
                    
                    magicGiftBox.appendChild(conf);
                    
                    // Trigger reflow for transition
                    void conf.offsetWidth;
                    
                    conf.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${Math.random() * 360}deg)`;
                    conf.style.opacity = '0';
                    
                    setTimeout(() => conf.remove(), 1000);
                }
            }
        });
    }

});
