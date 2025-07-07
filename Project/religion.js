// Site data with audio associations
const sites = [
    {
        name: "Sagrada Família",
        location: "Barcelona",
        description: "Gaudí's masterpiece, a symbol of Catalan Modernism and Catholic devotion",
        image: "Images/SagradaFamilia.png",
        audio: "gregorian-chant"
    },
    {
        name: "Cathedral of Santiago", 
        location: "Santiago de Compostela",
        description: "End point of the famous Camino pilgrimage route",
        image: "Images/SantiagoDeCompostela.png",
        audio: "pilgrimage-song"
    },
    {
        name: "Mezquita-Catedral",
        location: "Córdoba",
        description: "A stunning example of Islamic architecture converted to Christianity",
        image: "Images/MezquitaCatedral.png",
        audio: "mezquita-prayer"
    },
    {
        name: "Alhambra",
        location: "Granada",
        description: "Islamic palace complex showcasing Moorish architectural brilliance",
        image: "Images/AlhambraGranada.png",
        audio: "mezquita-prayer"
    }
];

// Audio elements
const audioElements = {
    'gregorian-chant': document.getElementById('gregorian-chant'),
    'mezquita-prayer': document.getElementById('mezquita-prayer'),
    'pilgrimage-song': document.getElementById('pilgrimage-song')
};

let currentAudio = null;
let currentImageIndex = 0;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initStatistics();
    initTimeline();
    initGallery();
    initAudioPlayers();
    initScrollAnimations();
    
    // Auto-advance gallery
    setInterval(autoAdvanceGallery, 8000);
});

// Initialize statistics animation
function initStatistics() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) observer.observe(statsSection);
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statBars = document.querySelectorAll('.stat-fill');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        animateValue(stat, 0, target, 1500);
    });
    
    statBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize timeline interactions
function initTimeline() {
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function() {
            const period = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showPeriod(period);
        });
    });
}

function showPeriod(period) {
    const periodInfo = {
        roman: {
            title: "Roman Christianity (300-711 AD)",
            content: "Early Christian communities established during Roman rule laid Spain's religious foundation with beautiful Gregorian chants."
        },
        islamic: {
            title: "Islamic Al-Andalus (711-1492 AD)",
            content: "Muslim rule brought architectural marvels like the Great Mosque of Córdoba and the tradition of the adhan (call to prayer)."
        },
        catholic: {
            title: "Catholic Spain (1492-Present)",
            content: "The Catholic Monarchs unified Spain under Christianity, building grand cathedrals filled with sacred music."
        }
    };
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'period-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>${periodInfo[period].title}</h3>
            <p>${periodInfo[period].content}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Initialize gallery functionality
function initGallery() {
    // Set first image as active
    changeImage(0);
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeImage(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight') {
            changeImage(currentImageIndex + 1);
        }
    });
}

function changeImage(index) {
    // Handle wrap-around
    if (index >= sites.length) index = 0;
    if (index < 0) index = sites.length - 1;
    
    currentImageIndex = index;
    const site = sites[index];
    
    // Update main content
    document.getElementById('main-image').src = site.image;
    document.getElementById('main-image').alt = site.name;
    document.getElementById('site-name').textContent = site.name;
    document.getElementById('site-location').textContent = site.location;
    document.getElementById('site-description').textContent = site.description;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    
    // Animation
    const mainImage = document.getElementById('main-image');
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.style.opacity = '1';
    }, 150);
}

function autoAdvanceGallery() {
    changeImage(currentImageIndex + 1);
}

// Initialize audio players
function initAudioPlayers() {
    // Set up all audio progress updaters
    Object.keys(audioElements).forEach(audioId => {
        const audio = audioElements[audioId];
        audio.addEventListener('timeupdate', function() {
            const progress = (audio.currentTime / audio.duration) * 100;
            document.querySelector(`.progress-fill[data-audio="${audioId}"]`).style.width = `${progress}%`;
        });
        
        audio.addEventListener('ended', function() {
            const button = document.querySelector(`button[onclick="playAudio('${audioId}', event)"]`);
            if (button) {
                button.querySelector('.play-icon').textContent = '▶️';
                button.querySelector('.play-text').textContent = 'Play';
            }
        });
    });
}

// Play audio function
function playAudio(audioId, event) {
    event.stopPropagation();
    
    const audio = audioElements[audioId];
    const button = event.target.closest('button');
    
    // Stop any currently playing audio
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    if (audio.paused) {
        audio.play();
        currentAudio = audio;
        if (button) {
            button.querySelector('.play-icon').textContent = '⏸️';
            button.querySelector('.play-text').textContent = 'Pause';
        }
    } else {
        audio.pause();
        if (button) {
            button.querySelector('.play-icon').textContent = '▶️';
            button.querySelector('.play-text').textContent = 'Play';
        }
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.timeline-item, .tradition-card, .stat-card, .sound-card').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scroll to sections
function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ 
        behavior: 'smooth' 
    });
}