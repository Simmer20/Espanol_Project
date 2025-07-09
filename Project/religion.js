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
    initScrollAnimations();
});

// Statistics Animation
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

// Timeline Interactions
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

// Gallery Functionality
function initGallery() {
    const images = document.querySelectorAll('.thumbnail');
    let currentImageIndex = 0;
    
    // Set first image as active
    changeImage(0);
    
    // Arrow buttons
    document.querySelector('.gallery-arrow.left').addEventListener('click', () => changeImage(-1));
    document.querySelector('.gallery-arrow.right').addEventListener('click', () => changeImage(1));
    
    // Thumbnail clicks
    images.forEach((img, i) => {
        img.addEventListener('click', () => {
            currentImageIndex = i;
            changeImage(0);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    });
    
    // Auto-advance every 8 seconds
    setInterval(() => changeImage(1), 8000);
    
    function changeImage(offset) {
        const images = document.querySelectorAll('.thumbnail');
        currentImageIndex = (currentImageIndex + offset + images.length) % images.length;
        
        // Update main image
        const activeThumb = images[currentImageIndex];
        document.getElementById('main-image').src = activeThumb.src;
        document.getElementById('main-image').alt = activeThumb.alt;
        
        // Update active thumbnail
        images.forEach((img, i) => {
            img.classList.toggle('active', i === currentImageIndex);
        });
        
        // Animation
        const mainImage = document.getElementById('main-image');
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 150);
    }
}

// Scroll Animations
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