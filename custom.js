// Custom JavaScript for PinMap

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('PinMap initialized');
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Better Stack tracking for pricing plan clicks
    const BETTERSTACK_TOKEN = 'i9qb6UucJhM4AHRqiAuUjNQZ';
    const BETTERSTACK_URL = 'https://s1355571.eu-nbg-2.betterstackdata.com/';
    
    // Generate or get user ID (6 letters, persistent)
    function getUserId() {
        let userId = localStorage.getItem('pinmap_user_id');
        if (!userId) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            userId = '';
            for (let i = 0; i < 6; i++) {
                userId += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            localStorage.setItem('pinmap_user_id', userId);
        }
        return userId;
    }
    
    // Generate or get session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem('pinmap_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('pinmap_session_id', sessionId);
        }
        return sessionId;
    }

    // Format date for Better Stack
    function formatDateForBetterStack() {
        const now = new Date();
        return now.getUTCFullYear() + '-' + 
               String(now.getUTCMonth() + 1).padStart(2, '0') + '-' + 
               String(now.getUTCDate()).padStart(2, '0') + ' ' + 
               String(now.getUTCHours()).padStart(2, '0') + ':' + 
               String(now.getUTCMinutes()).padStart(2, '0') + ':' + 
               String(now.getUTCSeconds()).padStart(2, '0') + ' UTC';
    }

    // Track page views
    function trackPageView() {
        const userId = getUserId();
        const sessionId = getSessionId();
        const pageName = window.location.pathname.includes('pricing') ? 'Cennik' : 
                        window.location.pathname === '/' || window.location.pathname.includes('index') ? 'Strona główna' : 
                        'Inna strona';
        
        const message = `[${userId}] Odwiedzono: ${pageName} | Session: ${sessionId} | URL: ${window.location.href} | Referrer: ${document.referrer || 'direct'}`;
        
        const logData = {
            dt: formatDateForBetterStack(),
            message: message
        };

        fetch(BETTERSTACK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BETTERSTACK_TOKEN}`
            },
            body: JSON.stringify(logData)
        }).catch(error => {
            console.error('Error tracking page view:', error);
        });
    }

    // Track page view on load
    trackPageView();

    // Track plan clicks
    function trackPlanClick(planName, planPrice) {
        const userId = getUserId();
        const sessionId = getSessionId();
        const clickKey = `plan_click_${planName}_${sessionId}`;
        
        // Check if already tracked in this session
        if (sessionStorage.getItem(clickKey)) {
            return;
        }
        
        // Mark as tracked
        sessionStorage.setItem(clickKey, 'true');
        
        // Prepare message with all data
        const message = `[${userId}] Plan clicked: ${planName} | Price: ${planPrice} | Session: ${sessionId} | UA: ${navigator.userAgent} | URL: ${window.location.href} | Referrer: ${document.referrer || 'direct'} | Screen: ${window.screen.width}x${window.screen.height}`;
        
        // Prepare log data matching Better Stack format
        const logData = {
            dt: formatDateForBetterStack(),
            message: message
        };

        // Send to Better Stack
        fetch(BETTERSTACK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BETTERSTACK_TOKEN}`
            },
            body: JSON.stringify(logData)
        }).catch(error => {
            console.error('Error tracking plan click:', error);
        });
    }

    // Add click tracking to pricing buttons
    if (window.location.pathname.includes('pricing.html')) {
        // Track Starter plan
        const starterBtn = document.querySelector('.col-lg-4:nth-child(1) .btn');
        if (starterBtn) {
            starterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                trackPlanClick('Starter', '49 PLN');
                // Allow normal navigation after tracking
                setTimeout(() => window.location.href = '#cta', 100);
            });
        }

        // Track Professional plan
        const proBtn = document.querySelector('.col-lg-4:nth-child(2) .btn');
        if (proBtn) {
            proBtn.addEventListener('click', function(e) {
                e.preventDefault();
                trackPlanClick('Professional', '249 PLN');
                setTimeout(() => window.location.href = '#cta', 100);
            });
        }

        // Track Turbo Boost plan
        const turboBtn = document.querySelector('.col-lg-4:nth-child(3) .btn');
        if (turboBtn) {
            turboBtn.addEventListener('click', function(e) {
                e.preventDefault();
                trackPlanClick('Turbo Boost', '305 PLN');
                setTimeout(() => window.location.href = '#cta', 100);
            });
        }
    }
});