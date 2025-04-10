// Intersection Observer для анимаций при скролле
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('menu-category')) {
                entry.target.querySelectorAll('li').forEach((item, index) => {
                    item.style.animationDelay = `${index * 0.1}s`;
                });
            }
        }
    });
}, observerOptions);

// Добавляем элементы для наблюдения
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.fade-in, .menu-category');
    elements.forEach(el => observer.observe(el));
});

// Таймер обратного отсчета
function updateCountdown() {
    const eventDate = new Date('2025-05-15T18:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = eventDate - now;

    if (timeLeft < 0) {
        document.getElementById('countdown').innerHTML = '<p>Мероприятие началось!</p>';
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.querySelector('.countdown-item .days').textContent = days.toString().padStart(2, '0');
    document.querySelector('.countdown-item .hours').textContent = hours.toString().padStart(2, '0');
    document.querySelector('.countdown-item .minutes').textContent = minutes.toString().padStart(2, '0');
    document.querySelector('.countdown-item .seconds').textContent = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Плавный скролл для навигации
document.querySelectorAll('.nav-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
        e.preventDefault();
        const section = document.querySelector(dot.getAttribute('data-section'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// Обновление активной навигационной точки при скролле
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-dot');

function updateActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navDots.forEach(dot => dot.classList.remove('active'));
            navDots[index].classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveSection);
updateActiveSection();

// Создание эффекта конфетти
function createConfetti() {
    const confettiColors = ['#FFD700', '#FFFFFF', '#800020', '#FFA500'];
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        confettiContainer.appendChild(confetti);

        // Удаляем конфетти после анимации
        confetti.addEventListener('animationend', () => confetti.remove());
    }

    // Удаляем контейнер после того как все конфетти исчезнут
    setTimeout(() => confettiContainer.remove(), 5000);
}

// Запускаем конфетти при загрузке страницы
window.addEventListener('load', createConfetti);

// Обработка фоновой музыки
const musicButton = document.getElementById('musicDog');
const backgroundMusic = document.getElementById('backgroundMusic');

if (musicButton && backgroundMusic) {
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicButton.classList.add('playing');
        } else {
            backgroundMusic.pause();
            musicButton.classList.remove('playing');
        }
    });
}

// Добавляем обработку свайпов для мобильных устройств
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', e => {
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        const currentSection = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        const currentSectionIndex = Array.from(sections).indexOf(currentSection.closest('.section'));

        if (diff > 0 && currentSectionIndex < sections.length - 1) {
            // Свайп вверх
            sections[currentSectionIndex + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (diff < 0 && currentSectionIndex > 0) {
            // Свайп вниз
            sections[currentSectionIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// RSVP Form Handling
const rsvpForm = document.getElementById('rsvpForm');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Здесь можно добавить логику отправки формы на сервер
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            guests: document.getElementById('guests').value,
            wishes: document.getElementById('wishes').value
        };

        // Анимация успешной отправки
        const button = rsvpForm.querySelector('.rsvp-button');
        button.innerHTML = 'Спасибо за подтверждение! ✨';
        button.style.backgroundColor = '#d4af37';
        button.style.color = '#800020';
        
        // Создаем эффект конфетти после отправки формы
        createConfetti();
        
        // Сброс формы и кнопки через 3 секунды
        setTimeout(() => {
            rsvpForm.reset();
            button.innerHTML = 'Подтвердить присутствие';
            button.style.backgroundColor = 'transparent';
            button.style.color = '#d4af37';
        }, 3000);
    });
}

// Валидация телефона
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = '+7' + value.substring(0, 10);
            value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
        }
        e.target.value = value;
    });
}

// Плавное появление элементов при скролле
function createIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('gallery-item')) {
                    entry.target.style.transform = 'scale(1)';
                    entry.target.style.opacity = '1';
                }
            }
        });
    }, options);

    // Наблюдаем за всеми элементами с классом fade-in и gallery-item
    document.querySelectorAll('.fade-in, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// Инициализация всех анимаций после загрузки страницы
window.addEventListener('load', () => {
    createIntersectionObserver();
    updateCountdown();
    checkVisibility();
    createConfetti();
});

// Оптимизация производительности при скролле
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        updateActiveDot();
        checkVisibility();
    });
});

// Menu item selection handling
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-content input[type="checkbox"]');
    const selectedItems = new Set();

    menuItems.forEach(item => {
        item.addEventListener('change', function() {
            const row = this.closest('tr');
            const dishName = row.querySelector('.dish-name').textContent;
            
            if(this.checked) {
                selectedItems.add(dishName);
                row.style.background = 'rgba(212, 175, 55, 0.1)';
            } else {
                selectedItems.delete(dishName);
                row.style.background = 'transparent';
            }

            // Save selection to localStorage
            localStorage.setItem('selectedMenuItems', JSON.stringify([...selectedItems]));
        });
    });

    // Restore selections from localStorage
    const savedSelections = JSON.parse(localStorage.getItem('selectedMenuItems') || '[]');
    menuItems.forEach(item => {
        const row = item.closest('tr');
        const dishName = row.querySelector('.dish-name').textContent;
        
        if(savedSelections.includes(dishName)) {
            item.checked = true;
            row.style.background = 'rgba(212, 175, 55, 0.1)';
            selectedItems.add(dishName);
        }
    });

    // Handle menu category animations
    const menuCategories = document.querySelectorAll('.menu-category');
    
    menuCategories.forEach(category => {
        category.addEventListener('toggle', function() {
            if(this.open) {
                this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // Add intersection observer for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    menuCategories.forEach(category => {
        observer.observe(category);
    });
});

// Calculate total price for selected items
function calculateTotal() {
    const selectedItems = document.querySelectorAll('.menu-content input[type="checkbox"]:checked');
    let total = 0;

    selectedItems.forEach(item => {
        const row = item.closest('tr');
        const priceText = row.querySelector('.dish-price').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        total += price;
    });

    return total;
}

// Handle menu category visibility
document.querySelectorAll('.menu-category summary').forEach(summary => {
    summary.addEventListener('click', (e) => {
        const details = summary.parentElement;
        const wasOpen = details.open;

        // Close all other details elements
        document.querySelectorAll('.menu-category[open]').forEach(openDetails => {
            if (openDetails !== details) {
                openDetails.open = false;
            }
        });

        // Prevent default to handle manually
        e.preventDefault();

        // Toggle current details
        details.open = !wasOpen;

        // Scroll into view if opening
        if (!wasOpen) {
            details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
});

// Modern JavaScript with ES6+ features
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all menu categories
    document.querySelectorAll('.menu-category').forEach(category => {
        observer.observe(category);
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Menu interactions
    const menuCategories = document.querySelectorAll('.menu-category');
    menuCategories.forEach(category => {
        // Add hover effect
        category.addEventListener('mouseenter', () => {
            category.style.transform = 'translateY(-5px)';
        });

        category.addEventListener('mouseleave', () => {
            category.style.transform = 'translateY(0)';
        });

        // Handle details element animations
        category.addEventListener('toggle', (e) => {
            if (category.open) {
                const content = category.querySelector('.menu-content');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Initialize menu item selection
    const menuItems = document.querySelectorAll('.menu-content input[type="checkbox"]');
    menuItems.forEach(item => {
        item.addEventListener('change', () => {
            const row = item.closest('tr');
            if (item.checked) {
                row.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            } else {
                row.style.backgroundColor = '';
            }
        });
    });

    // Add dynamic price calculation
    const calculateTotal = () => {
        let total = 0;
        const checkedItems = document.querySelectorAll('.menu-content input[type="checkbox"]:checked');
        checkedItems.forEach(item => {
            const priceCell = item.closest('tr').querySelector('.dish-price');
            const price = parseFloat(priceCell.textContent.replace(/[^\d.]/g, ''));
            total += price;
        });
        return total;
    };

    // Update total when items are selected
    menuItems.forEach(item => {
        item.addEventListener('change', () => {
            const total = calculateTotal();
            const totalElement = document.getElementById('total-price');
            if (totalElement) {
                totalElement.textContent = `Итого: ${total.toFixed(2)} ₽`;
            }
        });
    });

    // Add search functionality
    const searchInput = document.querySelector('.menu-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.menu-content tr');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Add sorting functionality
    const sortButtons = document.querySelectorAll('.sort-button');
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            const column = button.dataset.sort;
            const rows = Array.from(document.querySelectorAll('.menu-content tr'));
            
            rows.sort((a, b) => {
                const aValue = a.querySelector(`.dish-${column}`).textContent;
                const bValue = b.querySelector(`.dish-${column}`).textContent;
                return aValue.localeCompare(bValue);
            });

            const tbody = rows[0].parentNode;
            rows.forEach(row => tbody.appendChild(row));
        });
    });

    // Add lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Add dark mode toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    // Add print functionality
    const printButton = document.querySelector('.print-menu');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }

    // Add mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-toggle');
    const menuContainer = document.querySelector('.menu-container');
    
    if (mobileMenuButton && menuContainer) {
        mobileMenuButton.addEventListener('click', () => {
            menuContainer.classList.toggle('mobile-open');
            mobileMenuButton.setAttribute('aria-expanded', 
                menuContainer.classList.contains('mobile-open'));
        });
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openDetails = document.querySelector('details[open]');
            if (openDetails) {
                openDetails.removeAttribute('open');
            }
        }
    });

    // Performance optimization
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Auto-close other details when one is opened
    const menuCategories = document.querySelectorAll('.menu-category');
    
    menuCategories.forEach(category => {
        category.addEventListener('click', (e) => {
            if (e.target.tagName === 'SUMMARY') {
                menuCategories.forEach(otherCategory => {
                    if (otherCategory !== category && otherCategory.hasAttribute('open')) {
                        otherCategory.removeAttribute('open');
                    }
                });
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Optional: Add fade-in animation for menu items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInElements = document.querySelectorAll('.menu-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const menuCategories = document.querySelectorAll('.menu-category');
    
    // Add typewriter effect to summaries
    menuCategories.forEach(category => {
        const summary = category.querySelector('summary');
        summary.classList.add('typewriter');
    });

    // Smooth animation for details elements
    menuCategories.forEach(category => {
        category.addEventListener('toggle', (e) => {
            const content = category.querySelector('.menu-items');
            if (category.open) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
            } else {
                content.style.maxHeight = '0';
                content.style.opacity = '0';
            }
        });
    });

    // Lazy loading for menu items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        observer.observe(item);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.classList.add('fade-in');
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Add typewriter effect to category titles
    const summaries = document.querySelectorAll('.menu-category summary');
    summaries.forEach(summary => {
        summary.classList.add('typewriter');
    });

    // Handle menu category interactions
    const menuCategories = document.querySelectorAll('.menu-category');
    menuCategories.forEach(category => {
        category.addEventListener('toggle', () => {
            const items = category.querySelectorAll('.menu-item');
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.classList.remove('fade-in');
                void item.offsetWidth; // Trigger reflow
                item.classList.add('fade-in');
                item.style.animationDelay = `${index * 0.1}s`;
            });
        });
    });
});

// Handle smooth scrolling to menu sections
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

document.addEventListener('DOMContentLoaded', () => {
    // Add animation to menu items when their category is opened
    const menuCategories = document.querySelectorAll('.menu-category');
    
    menuCategories.forEach(category => {
        category.addEventListener('toggle', () => {
            if (category.open) {
                const items = category.querySelectorAll('.menu-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('fade-in');
                    }, index * 100);
                });
            }
        });
    });

    // Add typewriter effect to category titles
    const summaries = document.querySelectorAll('.menu-category summary');
    summaries.forEach(summary => {
        summary.classList.add('typewriter');
    });
});