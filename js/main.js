/**
 * Diani Splash Kids - Main JavaScript
 * Lightweight, vanilla JS - zero dependencies
 * Features: Sticky header, mobile nav, pricing toggle, FAQ accordion, 
 * smooth scroll, scroll animations, sticky CTA
 */

(function() {
    'use strict';

    // ========================================
    // DOM Element References
    // ========================================
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item');
    const pricingToggle = document.getElementById('pricingToggle');
    const individualPricing = document.getElementById('individualPricing');
    const groupPricing = document.getElementById('groupPricing');
    const labelIndividual = document.getElementById('labelIndividual');
    const labelGroup = document.getElementById('labelGroup');
    const stickyCta = document.getElementById('stickyCta');
    const scrollTopBtn = document.getElementById('scrollTop');
    const faqItems = document.querySelectorAll('.faq-item');
    const sections = document.querySelectorAll('section[id]');

    // ========================================
    // Utility Functions
    // ========================================
    
    /**
     * Throttle function execution
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce function execution
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // ========================================
    // Sticky Header
    // ========================================
    
    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class for styling
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ========================================
    // Mobile Navigation
    // ========================================
    
    function toggleMobileMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        navList.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }

    function closeMobileMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    
    function handleSmoothScroll(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Only handle anchor links
        if (!href || !href.startsWith('#')) return;
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            closeMobileMenu();
            
            // Calculate offset (header height + padding)
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update focus for accessibility
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({ preventScroll: true });
        }
    }

    // ========================================
    // Active Navigation Highlighting
    // ========================================
    
    function highlightActiveNav() {
        const scrollPos = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========================================
    // Pricing Toggle
    // ========================================
    
    function togglePricing() {
        const isGroup = pricingToggle.getAttribute('aria-pressed') === 'false';
        
        pricingToggle.setAttribute('aria-pressed', isGroup);
        pricingToggle.classList.toggle('active', isGroup);
        labelIndividual.classList.toggle('active', !isGroup);
        labelGroup.classList.toggle('active', isGroup);
        
        if (isGroup) {
            individualPricing.style.display = 'none';
            groupPricing.style.display = 'grid';
            groupPricing.style.animation = 'none';
            // Trigger reflow to restart animation
            groupPricing.offsetHeight;
            groupPricing.style.animation = 'fadeIn 0.4s ease-out';
        } else {
            groupPricing.style.display = 'none';
            individualPricing.style.display = 'grid';
            individualPricing.style.animation = 'none';
            individualPricing.offsetHeight;
            individualPricing.style.animation = 'fadeIn 0.4s ease-out';
        }
    }

    // ========================================
    // FAQ Accordion
    // ========================================
    
    function handleFaqToggle(e) {
        const clickedButton = e.currentTarget;
        const clickedItem = clickedButton.closest('.faq-item');
        const isActive = clickedItem.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(item => {
            if (item !== clickedItem) {
                item.classList.remove('active');
                const btn = item.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Toggle the clicked one
        if (isActive) {
            clickedItem.classList.remove('active');
            clickedButton.setAttribute('aria-expanded', 'false');
        } else {
            clickedItem.classList.add('active');
            clickedButton.setAttribute('aria-expanded', 'true');
        }
    }

    // ========================================
    // Sticky CTA (Mobile)
    // ========================================
    
    function handleStickyCta() {
        const scrollY = window.scrollY;
        const heroHeight = document.getElementById('hero').offsetHeight;
        
        // Show sticky CTA after scrolling past hero on mobile
        if (window.innerWidth <= 768 && scrollY > heroHeight * 0.5) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    }

    // ========================================
    // Scroll to Top Button
    // ========================================
    
    function handleScrollTop() {
        const scrollY = window.scrollY;
        
        if (scrollY > 600) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ========================================
    // Scroll Animations (Intersection Observer)
    // ========================================
    
    function initScrollAnimations() {
        // Elements to animate on scroll
        const animateElements = document.querySelectorAll(
            '.section-header, .stat-card, .attraction-card, .pricing-card, ' +
            '.party-feature, .faq-item, .highlight-item, .restaurant-text'
        );
        
        // Add animation class
        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
        });
        
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Optionally unobserve after animation
                        // observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            });
            
            animateElements.forEach(el => observer.observe(el));
        } else {
            // Fallback: show all elements immediately
            animateElements.forEach(el => el.classList.add('visible'));
        }
    }

    // ========================================
    // Parallax Effect (Hero)
    // ========================================
    
    function handleParallax() {
        if (window.innerWidth > 768) {
            const heroImage = document.querySelector('.hero-image');
            const scrollY = window.scrollY;
            const heroHeight = document.getElementById('hero').offsetHeight;
            
            if (scrollY < heroHeight) {
                const translateY = scrollY * 0.3;
                heroImage.style.transform = `translateY(${translateY}px) scale(1.1)`;
            }
        }
    }

    // ========================================
    // Performance: Lazy Load Below-Fold Images
    // ========================================
    
    function initLazyImages() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Image is already set, just unobserve
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px 0px'
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ========================================
    // Event Listeners
    // ========================================
    
    function initEventListeners() {
        // Header scroll
        window.addEventListener('scroll', throttle(() => {
            handleHeaderScroll();
            handleStickyCta();
            handleScrollTop();
            handleParallax();
            highlightActiveNav();
        }, 100));
        
        // Mobile menu
        menuToggle.addEventListener('click', toggleMobileMenu);
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });
        
        // Pricing toggle
        if (pricingToggle) {
            pricingToggle.addEventListener('click', togglePricing);
            labelIndividual.addEventListener('click', () => {
                if (labelGroup.classList.contains('active')) togglePricing();
            });
            labelGroup.addEventListener('click', () => {
                if (labelIndividual.classList.contains('active')) togglePricing();
            });
        }
        
        // FAQ items
        const faqButtons = document.querySelectorAll('.faq-question');
        faqButtons.forEach(btn => {
            // Set initial aria state
            btn.setAttribute('aria-expanded', btn.closest('.faq-item').classList.contains('active') ? 'true' : 'false');
            btn.addEventListener('click', handleFaqToggle);
        });
        
        // Scroll to top
        scrollTopBtn.addEventListener('click', scrollToTop);
        
        // Close mobile menu on resize to desktop
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }, 250));
        
        // Keyboard: Close mobile menu on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // ========================================
    // Initialize
    // ========================================
    
    function init() {
        initEventListeners();
        initScrollAnimations();
        initLazyImages();
        handleHeaderScroll();
        
        // Initial state: ensure individual pricing is visible
        if (individualPricing) {
            individualPricing.style.display = 'grid';
        }
        if (groupPricing) {
            groupPricing.style.display = 'none';
        }
    }

    // ========================================
    // Booking Form
    // ========================================

    function initBookingForm() {
        const form = document.getElementById('bookingForm');
        const submitBtn = document.getElementById('bookingSubmit');
        const successEl = document.getElementById('bookingSuccess');
        const dateInput = document.getElementById('bookingDate');

        if (!form) return;

        // Set minimum date to today
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        // Auto-select booking type based on buttons clicked
        document.querySelectorAll('[data-booking-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-booking-type');
                const radio = document.querySelector(`input[name="bookingType"][value="${type}"]`);
                if (radio) radio.checked = true;
            });
        });

        // Show inline error on a field
        function showError(input, message) {
            clearError(input);
            input.classList.add('booking-input--error');
            const err = document.createElement('span');
            err.className = 'booking-field-error';
            err.setAttribute('role', 'alert');
            err.textContent = message;
            input.closest('.input-wrapper').after(err);
        }

        function clearError(input) {
            input.classList.remove('booking-input--error');
            const prev = input.closest('.form-group');
            if (prev) {
                const existing = prev.querySelector('.booking-field-error');
                if (existing) existing.remove();
            }
        }

        // Validate the form
        function validate() {
            let valid = true;

            const name = document.getElementById('bookingName');
            const phone = document.getElementById('bookingPhone');
            const date = document.getElementById('bookingDate');
            const guests = document.getElementById('bookingGuests');

            if (name) {
                clearError(name);
                if (!name.value.trim() || name.value.trim().length < 2) {
                    showError(name, 'Please enter your full name.');
                    valid = false;
                }
            }

            if (phone) {
                clearError(phone);
                const digits = phone.value.replace(/\D/g, '');
                if (!phone.value.trim() || digits.length < 9) {
                    showError(phone, 'Please enter a valid phone number.');
                    valid = false;
                }
            }

            if (date) {
                clearError(date);
                if (!date.value) {
                    showError(date, 'Please choose a preferred visit date.');
                    valid = false;
                }
            }

            if (guests) {
                clearError(guests);
                if (!guests.value) {
                    showError(guests, 'Please select the number of guests.');
                    valid = false;
                }
            }

            return valid;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!validate()) return;

            // Loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Gather data for WhatsApp
            const formData = new FormData(form);
            const selectedTypeInput = document.querySelector('input[name="bookingType"]:checked');
            let type = 'Booking';
            if (selectedTypeInput && selectedTypeInput.nextElementSibling) {
                type = selectedTypeInput.nextElementSibling.textContent.trim();
            }
            const name = formData.get('name') || '';
            const phone = formData.get('phone') || '';
            const email = formData.get('email') || '';
            const date = formData.get('date') || '';
            const time = formData.get('time') || 'Not specified';
            const guests = formData.get('guests') || '';
            const notes = formData.get('notes') || 'None';
            
            // Format WhatsApp Message
            let message = `Hello Diani Splash Kids! I'd like to make a *${type}* reservation.\n\n`;
            message += `*Name:* ${name}\n`;
            message += `*Phone:* ${phone}\n`;
            if (email) message += `*Email:* ${email}\n`;
            message += `*Date:* ${date}\n`;
            message += `*Time:* ${time}\n`;
            message += `*Guests:* ${guests}\n`;
            if (notes !== 'None' && notes.trim() !== '') message += `*Special Requests:* ${notes}\n`;
            
            // Business Number
            const phoneNum = "254114150622";
            const whatsappUrl = `https://wa.me/${phoneNum}?text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');

            // Show success locally
            setTimeout(function() {
                form.hidden = true;
                if (successEl) {
                    successEl.hidden = false;
                    successEl.focus();
                }
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 800);
        });

        // Clear errors on input
        form.querySelectorAll('.booking-input').forEach(function(input) {
            input.addEventListener('input', function() { clearError(input); });
            input.addEventListener('change', function() { clearError(input); });
        });
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            initBookingForm();
        });
    } else {
        init();
        initBookingForm();
    }

})();
