// Custom JavaScript for PinMap

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('PinMap initialized');
    
    // Add any custom JavaScript functionality here
    
    // Example: Smooth scrolling for anchor links
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
    
    // Add more custom functionality as needed
});