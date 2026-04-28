// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    // Inisialisasi semua fungsi
    initMenuToggle();
    initSmoothScroll();
    initContactForm();
    initProgressBars();
    initCTAButton();
    initServiceCards();
});

// ===== 1. MOBILE MENU TOGGLE =====
function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu saat tombol diklik
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Tutup menu saat link diklik
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Tutup menu saat klik di luar
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navMenu.classList.remove('active');
        }
    });
}

// ===== 2. SMOOTH SCROLL =====
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== 3. CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validasi
            if (!name || !email || !message) {
                showMessage('Harap isi semua field!', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('Email tidak valid!', 'error');
                return;
            }

            // Simulasi pengiriman form (di production gunakan API)
            console.log('Form Data:', { name, email, message });
            
            // Tampilkan pesan sukses
            showMessage('Pesan Anda telah dikirim! Terima kasih.', 'success');

            // Reset form
            contactForm.reset();
        });
    }

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;

        // Sembunyikan pesan setelah 5 detik
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// ===== 4. ANIMATED PROGRESS BARS =====
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    });

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// ===== 5. CTA BUTTON =====
function initCTAButton() {
    const ctaButton = document.getElementById('ctaButton');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const servicesSection = document.getElementById('services');
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        });

        // Tambah visual feedback
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// ===== 6. SERVICE CARDS INTERACTIVITY =====
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });

        // Hover count
        card.addEventListener('mouseenter', function() {
            console.log('Hovering service card #' + (index + 1));
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Fungsi untuk mendapatkan query parameter dari URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fungsi untuk localStorage
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log('Data saved to localStorage:', key);
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// Fungsi untuk membuat delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Bisa dikembangkan dengan Toast notification
}

// ===== LOG INFO =====
console.log('%c Website berhasil dimuat!', 'color: green; font-size: 16px; font-weight: bold;');
console.log('Versi: 1.0');
console.log('Dibuat: 2026');
