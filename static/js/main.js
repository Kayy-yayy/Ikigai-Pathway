document.addEventListener('DOMContentLoaded', function() {
    // Signup form handling
    const signupForm = document.getElementById('signupForm');
    const signupOverlay = document.getElementById('signupOverlay');
    const beginJourneyBtn = document.getElementById('beginJourneyBtn');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const avatarInput = document.querySelector('input[name="avatar"]:checked');
            
            if (!email || !username || !avatarInput) {
                alert('Please fill in all fields and select an avatar.');
                return;
            }
            
            const avatar = avatarInput.value;
            
            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    avatar: avatar
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Reload the page to update the UI based on the user session
                    window.location.reload();
                } else {
                    alert(data.message || 'There was an error signing up. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error signing up:', error);
                alert('There was an error signing up. Please try again.');
            });
        });
    }
    
    // Show signup overlay when "Begin Your Journey" is clicked
    if (beginJourneyBtn && signupOverlay) {
        beginJourneyBtn.addEventListener('click', function() {
            signupOverlay.classList.add('active');
        });
        
        // Close signup overlay when clicking outside the modal
        signupOverlay.addEventListener('click', function(e) {
            if (e.target === signupOverlay) {
                signupOverlay.classList.remove('active');
            }
        });
    }
    
    // Set user avatar if logged in
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        // This would typically be set server-side with the user's actual avatar
        // For now, we'll set a default
        fetch('/get_user_data', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.avatar) {
                userAvatar.style.backgroundImage = `url('${data.avatar}')`;
            } else {
                userAvatar.style.backgroundImage = "url('/static/images/avatar1.png')";
            }
        })
        .catch(error => {
            console.error('Error getting user data:', error);
            userAvatar.style.backgroundImage = "url('/static/images/avatar1.png')";
        });
    }
    
    // Pillar page functionality is handled in the pillar.html template
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation classes when elements come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
});
