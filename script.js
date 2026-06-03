/* ==========================================================================
   AUTOREFLECT - PREMIUM AUTO DETAILING STUDIO JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Sticky Header scroll effect
    // ==========================================
    const header = document.querySelector('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Run on init and scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // ==========================================
    // 2. Mobile Menu / Hamburger Toggle
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            navMenu.classList.toggle('is-active');
            // Toggle body overflow to prevent background scrolling
            document.body.style.overflow = navMenu.classList.contains('is-active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked (excluding dropdown toggle on mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (link.classList.contains('dropdown-toggle') && window.innerWidth <= 768) {
                    return; // Let dropdown handler toggle the sub-menu on mobile
                }
                hamburger.classList.remove('is-active');
                navMenu.classList.remove('is-active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // 2.5 Mobile Dropdown Toggle Handler
    // ==========================================
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownParent = document.querySelector('.nav-item.dropdown');
    
    if (dropdownToggle && dropdownParent) {
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Prevent instant navigation to services.php on mobile tap
                dropdownParent.classList.toggle('active-mobile');
            }
        });
    }

    // ==========================================
    // 3. Highlight Active Navigation Item
    // ==========================================
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const currentSearch = window.location.search;
    const currentFullPage = currentPage + currentSearch;

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // Parent services link is marked active if we are looking at services list OR any individual service details
        if (currentPage === linkPage || 
            (currentPage === '' && linkPage === 'index.html') || 
            (['ceramic.html', 'ppf.html', 'paint.html', 'wash.html'].includes(currentPage) && linkPage === 'services.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Highlight active dropdown link
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentFullPage === linkHref) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ==========================================
    // 3.5 Pre-select Service from Query Param (Static Site workaround)
    // ==========================================
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        if (serviceParam) {
            let selectValue = "";
            if (serviceParam === 'ceramic') selectValue = "Ceramic Coating";
            else if (serviceParam === 'ppf') selectValue = "PPF Protection Film";
            else if (serviceParam === 'paint' || serviceParam === 'correction') selectValue = "Paint Correction";
            else if (serviceParam === 'wash') selectValue = "Premium Car Wash";
            
            if (selectValue) {
                serviceSelect.value = selectValue;
            }
        }
    }

    // ==========================================
    // 4. Scroll Reveal Intersection Observer
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Once animated, no need to track it anymore
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12, // Trigger when 12% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Slightly negative bottom margin for better timing
        });
        
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => {
            el.classList.add('active');
        });
    }

    // ==========================================
    // 5. Contact Form Client-side Handling
    // ==========================================
    const contactForm = document.getElementById('detailingContactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather input fields
            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            const carInput = document.getElementById('car');
            const serviceSelect = document.getElementById('service');
            const messageInput = document.getElementById('message');
            
            // Simple validation
            if (!nameInput.value.trim() || !phoneInput.value.trim() || !carInput.value.trim()) {
                alert('Please fill in all the required fields (Name, Phone Number, and Car Model).');
                return;
            }
            
            // Show premium loading state on button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Request...';
            
            // 1. Generate WhatsApp message & Redirect URL (100% Free Mobile alert)
            const waName = encodeURIComponent(nameInput.value.trim());
            const waPhone = encodeURIComponent(phoneInput.value.trim());
            const waCar = encodeURIComponent(carInput.value.trim());
            const waService = encodeURIComponent(serviceSelect ? serviceSelect.value : "Not Selected");
            const waMsg = encodeURIComponent(messageInput.value.trim() || "No special requests");
            
            const waText = `*New Detailing Booking Request*%0A%0A` +
                           `*Name:* ${waName}%0A` +
                           `*Phone:* ${waPhone}%0A` +
                           `*Car:* ${waCar}%0A` +
                           `*Service:* ${waService}%0A` +
                           `*Message:* ${waMsg}`;
            
            const whatsappUrl = `https://wa.me/919106923366?text=${waText}`;
            
            // 2. Web3Forms API submission (Background Email Backup)
            const accessKey = "2dbedf68-b855-4e98-a2f0-212f60fa89b7"; 
            
            const formData = {
                access_key: accessKey,
                name: nameInput.value,
                phone: phoneInput.value,
                car_model: carInput.value,
                desired_service: serviceSelect ? serviceSelect.value : "Not Selected",
                message: messageInput.value,
                subject: `New Detailing Slot Booking Request from ${nameInput.value}`
            };
            
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // Success State Styling
                    contactForm.innerHTML = `
                        <div class="glass-panel" style="padding: 40px; text-align: center; border-color: var(--primary-yellow); animation: glow-pulse 2s infinite alternate;">
                            <div class="icon-box" style="background: var(--primary-yellow); color: var(--bg-dark); box-shadow: var(--glow-shadow); margin-bottom: 20px;">
                                <i class="fas fa-check" style="font-size: 1.8rem;"></i>
                            </div>
                            <h3 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 15px; color: var(--primary-yellow); text-transform: uppercase;">Request Received!</h3>
                            <p style="color: var(--text-white); margin-bottom: 25px;">Thank you, <strong>${nameInput.value}</strong>. We have received your slot booking request. Our detailing consultant will call you at <strong>${phoneInput.value}</strong> shortly.</p>
                            
                            <div style="display: flex; flex-direction: column; gap: 15px; align-items: center; margin-top: 20px;">
                                <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="border-color: #25d366; color: #25d366; width: 100%; max-width: 280px; display: inline-flex; justify-content: center; align-items: center; gap: 8px;">
                                    <i class="fab fa-whatsapp" style="font-size: 1.2rem;"></i> Send on WhatsApp
                                </a>
                                <a href="index.html" class="btn btn-primary" style="width: 100%; max-width: 280px;">Return to Home</a>
                            </div>
                        </div>
                    `;
                } else {
                    console.error(json);
                    alert(json.message || "Something went wrong. Please try again.");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            })
            .catch(error => {
                console.error(error);
                // Fallback success allowing WhatsApp sending anyway
                contactForm.innerHTML = `
                    <div class="glass-panel" style="padding: 40px; text-align: center; border-color: var(--primary-yellow); animation: glow-pulse 2s infinite alternate;">
                        <div class="icon-box" style="background: var(--primary-yellow); color: var(--bg-dark); box-shadow: var(--glow-shadow); margin-bottom: 20px;">
                            <i class="fas fa-check" style="font-size: 1.8rem;"></i>
                        </div>
                        <h3 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 15px; color: var(--primary-yellow); text-transform: uppercase;">Request Saved!</h3>
                        <p style="color: var(--text-white); margin-bottom: 25px;">Thank you, <strong>${nameInput.value}</strong>. You can click below to instantly send this request over WhatsApp as well.</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 15px; align-items: center; margin-top: 20px;">
                            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="border-color: #25d366; color: #25d366; width: 100%; max-width: 280px; display: inline-flex; justify-content: center; align-items: center; gap: 8px;">
                                <i class="fab fa-whatsapp" style="font-size: 1.2rem;"></i> Send on WhatsApp
                            </a>
                            <a href="index.html" class="btn btn-primary" style="width: 100%; max-width: 280px;">Return to Home</a>
                        </div>
                    </div>
                `;
            });
        });
    }

    // ==========================================
    // 6. Before/After Image Comparison Slider
    // ==========================================
    const baContainers = document.querySelectorAll('.before-after-slider-container');
    
    baContainers.forEach(container => {
        const handle = container.querySelector('.slider-handle');
        const afterImg = container.querySelector('.after-img');
        const bar = container.querySelector('.slider-bar');
        const button = container.querySelector('.slider-button');
        
        if (handle && afterImg && bar && button) {
            handle.addEventListener('input', (e) => {
                const percent = e.target.value;
                afterImg.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
                bar.style.left = `${percent}%`;
                button.style.left = `${percent}%`;
            });
        }
    });
});
