document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Accordion functionality for curriculum
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const toggle = item.querySelector('.toggle-icon');
        
        header.addEventListener('click', () => {
            const isActive = content.style.maxHeight;
            
            // Close all accordion items
            accordionItems.forEach(accItem => {
                const accContent = accItem.querySelector('.accordion-content');
                const accToggle = accItem.querySelector('.toggle-icon');
                
                if (accContent !== content) {
                    accContent.style.maxHeight = null;
                    accToggle.textContent = '+';
                }
            });
            
            // Toggle current item
            if (!isActive) {
                content.style.maxHeight = content.scrollHeight + 'px';
                toggle.textContent = '−';
            } else {
                content.style.maxHeight = null;
                toggle.textContent = '+';
            }
        });
    });

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = question.querySelector('.toggle-icon');
        
        question.addEventListener('click', () => {
            const isActive = answer.style.maxHeight;
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                if (faqItem !== item) {
                    const faqAnswer = faqItem.querySelector('.faq-answer');
                    const faqToggle = faqItem.querySelector('.toggle-icon');
                    faqAnswer.style.maxHeight = null;
                    faqToggle.textContent = '+';
                }
            });
            
            // Toggle current FAQ item
            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.textContent = '−';
            } else {
                answer.style.maxHeight = null;
                toggle.textContent = '+';
            }
        });
    });

    // Form submission
    const enrollmentForm = document.getElementById('enrollmentForm');
    
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', formObject);
            
            // Show success message
            alert('Thank you for your interest! Our team will contact you shortly.');
            this.reset();
        });
    }

    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.pricing-card, .accordion-item, .faq-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    document.querySelectorAll('.pricing-card, .accordion-item, .faq-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Video placeholder click handler
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // In a real implementation, you would open a modal with the video
            alert('Video player would open here');
        });
    }

    // Hero image fallback
    const heroImg = document.querySelector('.certificate-img');
    if (heroImg) {
        const fallbackUrl = 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=900&q=80';
        heroImg.addEventListener('error', function() {
            if (heroImg.src !== fallbackUrl) {
                heroImg.src = fallbackUrl;
            }
        });
    }

    // ======================
    // Checkout page behavior
    // ======================
    const isCheckout = /checkout\.html($|\?)/.test(window.location.pathname) || document.body.classList.contains('checkout');
    if (isCheckout) {
        const programPrices = {
            'self-paced': 89999,
            'instructor-led': 189999
        };

        // Supported coupons
        // CEH10 -> 10% off, INDIA15 -> 15% off, STUDENT2K -> flat ₹2000 off
        const coupons = {
            'CEH10': { type: 'percent', value: 10 },
            'INDIA15': { type: 'percent', value: 15 },
            'STUDENT2K': { type: 'flat', value: 2000 },
            'LPU_12215058CEH': { type: 'target_total', value: 25999 }
        };

        const qs = new URLSearchParams(window.location.search);
        const selectedPlan = qs.get('plan');

        const programSelect = document.getElementById('programSelect');
        const couponInput = document.getElementById('coupon');
        const applyCouponBtn = document.getElementById('applyCoupon');
        const couponNotice = document.getElementById('couponNotice');
        const form = document.getElementById('checkoutForm');

        const summaryProgram = document.getElementById('summaryProgram');
        const summaryPrice = document.getElementById('summaryPrice');
        const summaryDiscount = document.getElementById('summaryDiscount');
        const summaryTotal = document.getElementById('summaryTotal');

        const formatINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n).replace('₹\u00A0','₹');

        const setProgramFromQuery = () => {
            if (selectedPlan && (selectedPlan in programPrices)) {
                programSelect.value = selectedPlan;
            }
        };

        let basePrice = 0;
        let discountValue = 0;
        let appliedCoupon = null;

        const updateSummary = () => {
            const key = programSelect.value;
            basePrice = programPrices[key] || 0;
            const total = Math.max(0, basePrice - discountValue);
            const label = key === 'self-paced' ? 'Self-Paced Learning' : key === 'instructor-led' ? 'Instructor-Led Training' : '—';
            summaryProgram.textContent = label;
            summaryPrice.textContent = basePrice ? formatINR(basePrice) : '₹0';
            summaryDiscount.textContent = `− ${discountValue ? formatINR(discountValue) : '₹0'}`;
            summaryTotal.textContent = formatINR(total);
        };

        const applyCoupon = () => {
            const code = (couponInput.value || '').trim().toUpperCase();
            discountValue = 0;
            appliedCoupon = null;
            if (!code) {
                couponNotice.style.display = 'none';
                updateSummary();
                return;
            }
            if (!programSelect.value) {
                couponNotice.style.display = 'block';
                couponNotice.textContent = 'Select a program before applying a coupon.';
                return;
            }
            if (coupons[code]) {
                appliedCoupon = coupons[code];
                if (appliedCoupon.type === 'percent') {
                    discountValue = Math.round((appliedCoupon.value / 100) * (programPrices[programSelect.value] || 0));
                    couponNotice.textContent = `Coupon applied: ${code} (−${appliedCoupon.value}%)`;
                } else if (appliedCoupon.type === 'flat') {
                    discountValue = appliedCoupon.value;
                    couponNotice.textContent = `Coupon applied: ${code} (−${formatINR(appliedCoupon.value)})`;
                } else if (appliedCoupon.type === 'target_total') {
                    const base = programPrices[programSelect.value] || 0;
                    discountValue = Math.max(0, base - appliedCoupon.value);
                    couponNotice.textContent = `Coupon applied: ${code} (Total set to ${formatINR(appliedCoupon.value)})`;
                }
                couponNotice.style.display = 'block';
            } else {
                couponNotice.style.display = 'block';
                couponNotice.textContent = 'Invalid coupon code. Try CEH10, INDIA15, STUDENT2K, or LPU_12215058CEH.';
            }
            updateSummary();
        };

        if (programSelect) {
            setProgramFromQuery();
            programSelect.addEventListener('change', () => {
                // Reset coupon when program changes
                discountValue = 0;
                appliedCoupon = null;
                if (couponInput) couponInput.value = '';
                couponNotice.style.display = 'none';
                updateSummary();
            });
        }

        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', applyCoupon);
        }

        updateSummary();

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                if (!programSelect.value) {
                    alert('Please select a program.');
                    return;
                }
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const totalAmount = Math.max(0, (programPrices[programSelect.value] || 0) - discountValue);
                const params = new URLSearchParams({
                    name: data.fullName || '',
                    program: programSelect.value,
                    amount: String(totalAmount),
                    phone: data.phone || ''
                });
                window.location.href = `payment.html?${params.toString()}`;
            });
        }
    }

    // ======================
    // Payment page behavior
    // ======================
    if (/payment\.html($|\?)/.test(window.location.pathname)) {
        const qs = new URLSearchParams(window.location.search);
        const name = qs.get('name') || '';
        const programKey = qs.get('program') || '';
        const amount = parseInt(qs.get('amount') || '0', 10) || 0;
        const phone = qs.get('phone') || '';

        const sumName = document.getElementById('sumName');
        const sumProgram = document.getElementById('sumProgram');
        const sumAmount = document.getElementById('sumAmount');
        const payPhone = document.getElementById('payPhone');
        const phoneHelp = document.getElementById('phoneHelp');
        const sendOtpBtn = document.getElementById('sendOtpBtn');
        const resendOtpBtn = document.getElementById('resendOtpBtn');
        const otpArea = document.getElementById('otpArea');
        const otpInputs = document.querySelectorAll('#otpInputs input');
        const otpNotice = document.getElementById('otpNotice');
        const paymentForm = document.getElementById('paymentForm');

        const label = programKey === 'self-paced' ? 'Self-Paced Learning' : programKey === 'instructor-led' ? 'Instructor-Led Training' : '—';
        const formatINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n).replace('₹\u00A0','₹');
        if (sumName) sumName.textContent = name || '—';
        if (sumProgram) sumProgram.textContent = label;
        if (sumAmount) sumAmount.textContent = formatINR(amount);
        if (payPhone && phone) payPhone.value = phone;
        if (phoneHelp) phoneHelp.textContent = 'You will receive a 6-digit OTP.';

        const genOtp = () => String(Math.floor(100000 + Math.random() * 900000));
        let currentOtp = null;
        let canResendAt = 0;

        const startOtpFlow = () => {
            currentOtp = genOtp();
            canResendAt = Date.now() + 30_000; // 30s cooldown
            otpArea.style.display = 'block';
            otpNotice.style.display = 'block';
            otpNotice.textContent = `OTP sent to ${payPhone.value}. (Demo OTP: ${currentOtp})`;
            otpInputs.forEach((i) => { i.value = ''; });
            otpInputs[0].focus();
        };

        const validPhone = (v) => /^[0-9]{10}$/.test(v.replace(/\D/g, ''));

        if (sendOtpBtn) {
            sendOtpBtn.addEventListener('click', () => {
                if (!validPhone(payPhone.value)) {
                    alert('Enter a valid 10-digit phone number');
                    return;
                }
                startOtpFlow();
            });
        }

        if (resendOtpBtn) {
            resendOtpBtn.addEventListener('click', () => {
                const now = Date.now();
                if (now < canResendAt) {
                    const secs = Math.ceil((canResendAt - now) / 1000);
                    otpNotice.style.display = 'block';
                    otpNotice.textContent = `Please wait ${secs}s before resending.`;
                    return;
                }
                startOtpFlow();
            });
        }

        // OTP inputs auto-advance
        otpInputs.forEach((input, idx) => {
            input.addEventListener('input', (e) => {
                const v = e.target.value.replace(/\D/g, '');
                e.target.value = v.slice(-1);
                if (v && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                    otpInputs[idx - 1].focus();
                }
            });
        });

        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!currentOtp) {
                    alert('Please request an OTP first.');
                    return;
                }
                const entered = Array.from(otpInputs).map(i => i.value).join('');
                if (entered.length !== 6) {
                    otpNotice.style.display = 'block';
                    otpNotice.textContent = 'Enter the 6-digit OTP.';
                    return;
                }
                if (entered !== currentOtp) {
                    otpNotice.style.display = 'block';
                    otpNotice.textContent = 'Invalid OTP. Please try again.';
                    return;
                }
                const nextParams = new URLSearchParams({
                    name: name || '',
                    program: programKey || '',
                    amount: String(amount)
                });
                window.location.href = `payment-options.html?${nextParams.toString()}`;
            });
        }
    }
});

// Add active class to nav links on scroll
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY + 100;
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector(`.nav-links a[href*=${sectionId}]`).classList.add('active');
        } else {
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            if (navLink) navLink.classList.remove('active');
        }
    });
});
