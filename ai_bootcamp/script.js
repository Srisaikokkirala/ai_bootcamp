/* ============================================
   EduVerse — Student Registration Portal
   JavaScript Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');
    const form = document.getElementById('registrationForm');
    const formContainer = document.getElementById('formContainer');
    const successState = document.getElementById('successState');
    const newRegistrationBtn = document.getElementById('newRegistrationBtn');

    // Steps
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLine1 = document.getElementById('progressLine1');
    const progressLine2 = document.getElementById('progressLine2');

    // Navigation buttons
    const nextToStep2 = document.getElementById('nextToStep2');
    const backToStep1 = document.getElementById('backToStep1');
    const nextToStep3 = document.getElementById('nextToStep3');
    const backToStep2 = document.getElementById('backToStep2');

    let currentStep = 1;

    // --- Navbar Scroll Effect ---
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    });

    // --- Mobile Navigation ---
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

            if (navLink) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });

    // --- Stat Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(target * easeOut);
                    stat.textContent = current.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    }
                }

                requestAnimationFrame(updateCount);
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on load

    // --- Form Step Navigation ---
    function goToStep(step) {
        // Hide all steps
        steps.forEach(s => s.classList.remove('active'));

        // Show target step
        document.getElementById(`step${step}`).classList.add('active');

        // Update progress indicators
        progressSteps.forEach((ps, index) => {
            const stepNum = index + 1;
            ps.classList.remove('active', 'completed');

            if (stepNum < step) {
                ps.classList.add('completed');
            } else if (stepNum === step) {
                ps.classList.add('active');
            }
        });

        // Update progress lines
        if (step >= 2) {
            progressLine1.style.width = '100%';
        } else {
            progressLine1.style.width = '0%';
        }

        if (step >= 3) {
            progressLine2.style.width = '100%';
        } else {
            progressLine2.style.width = '0%';
        }

        currentStep = step;

        // Scroll to form
        const registerSection = document.getElementById('register');
        if (registerSection) {
            const offset = registerSection.offsetTop - 100;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    }

    // --- Form Validation ---
    function validateField(fieldId) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}Error`);
        const wrapper = field.closest('.input-wrapper');
        let isValid = true;
        let errorMsg = '';

        // Clear previous state
        if (wrapper) wrapper.classList.remove('has-error');
        if (errorEl) errorEl.textContent = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            const label = field.closest('.form-group').querySelector('label').textContent.replace(' *', '');
            errorMsg = `${label} is required`;
        } else if (fieldId === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMsg = 'Please enter a valid email address';
            }
        } else if (fieldId === 'phone' && field.value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
            if (!phoneRegex.test(field.value.trim())) {
                isValid = false;
                errorMsg = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            if (wrapper) wrapper.classList.add('has-error');
            if (errorEl) errorEl.textContent = errorMsg;
        }

        return isValid;
    }

    function validateStep(step) {
        let isValid = true;
        const fieldsPerStep = {
            1: ['firstName', 'lastName', 'email', 'phone', 'dob', 'gender'],
            2: ['program', 'admissionYear', 'prevSchool', 'percentage', 'address']
        };

        const fields = fieldsPerStep[step] || [];
        fields.forEach(fieldId => {
            if (!validateField(fieldId)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Real-time validation on blur
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => {
            if (field.id && document.getElementById(`${field.id}Error`)) {
                validateField(field.id);
            }
        });

        // Clear error on input
        field.addEventListener('input', () => {
            const errorEl = document.getElementById(`${field.id}Error`);
            const wrapper = field.closest('.input-wrapper');
            if (errorEl) errorEl.textContent = '';
            if (wrapper) wrapper.classList.remove('has-error');
        });
    });

    // --- Step Navigation Handlers ---
    nextToStep2.addEventListener('click', () => {
        if (validateStep(1)) {
            goToStep(2);
        }
    });

    backToStep1.addEventListener('click', () => {
        goToStep(1);
    });

    nextToStep3.addEventListener('click', () => {
        if (validateStep(2)) {
            populateReview();
            goToStep(3);
        }
    });

    backToStep2.addEventListener('click', () => {
        goToStep(2);
    });

    // --- Populate Review ---
    function populateReview() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        document.getElementById('reviewName').textContent = `${firstName} ${lastName}`;
        document.getElementById('reviewEmail').textContent = document.getElementById('email').value;
        document.getElementById('reviewPhone').textContent = document.getElementById('phone').value;

        const dob = document.getElementById('dob').value;
        if (dob) {
            const date = new Date(dob);
            document.getElementById('reviewDob').textContent = date.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        }

        const genderSelect = document.getElementById('gender');
        document.getElementById('reviewGender').textContent =
            genderSelect.options[genderSelect.selectedIndex]?.text || '—';

        const programSelect = document.getElementById('program');
        document.getElementById('reviewProgram').textContent =
            programSelect.options[programSelect.selectedIndex]?.text || '—';

        document.getElementById('reviewYear').textContent = document.getElementById('admissionYear').value;
        document.getElementById('reviewSchool').textContent = document.getElementById('prevSchool').value;
        document.getElementById('reviewScore').textContent = document.getElementById('percentage').value;
        document.getElementById('reviewAddress').textContent = document.getElementById('address').value;
    }

    // --- Form Submission ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate terms checkbox
        const termsAgree = document.getElementById('termsAgree');
        const termsError = document.getElementById('termsError');

        if (!termsAgree.checked) {
            termsError.textContent = 'You must agree to the Terms & Conditions';
            return;
        }
        termsError.textContent = '';

        // Generate application ID
        const year = document.getElementById('admissionYear').value || '2026';
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const appId = `EDU-${year}-${randomNum}`;
        document.getElementById('appId').textContent = appId;

        // Show success state
        form.style.display = 'none';
        successState.classList.add('active');

        // Hide progress bar
        document.querySelector('.form-progress').style.display = 'none';

        // Scroll to top of registration
        const registerSection = document.getElementById('register');
        if (registerSection) {
            const offset = registerSection.offsetTop - 100;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });

    // --- New Registration ---
    newRegistrationBtn.addEventListener('click', () => {
        form.reset();
        form.style.display = 'block';
        successState.classList.remove('active');
        document.querySelector('.form-progress').style.display = 'flex';

        // Clear all error states
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        document.querySelectorAll('.input-wrapper').forEach(el => el.classList.remove('has-error'));

        goToStep(1);
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offset = target.offsetTop - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe program cards
    document.querySelectorAll('.program-card, .contact-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add stagger delay to program cards
    document.querySelectorAll('.program-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.contact-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // --- Keyboard Accessibility ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('open');
        }
    });
});
