// Social Media App - Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Social Media App initialized!');
    
    initializeApp();
});

function initializeApp() {
    initializeLikeButtons();
    initializeFollowButtons();
    initializeCommentForms();
    initializePostForms();
    enhanceUIInteractions();
    setupRealTimeFeatures();
}

// Like functionality
function initializeLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = this.dataset.postId;
            const likeCount = this.querySelector('.like-count');
            
            // Add loading state
            this.classList.add('loading');
            this.innerHTML = '🤍 Loading...';
            
            fetch(`/like_post/${postId}/`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.liked) {
                    this.classList.add('liked');
                    this.innerHTML = `❤️ Liked (<span class="like-count">${data.like_count}</span>)`;
                    showNotification('Post liked!', 'success');
                } else {
                    this.classList.remove('liked');
                    this.innerHTML = `🤍 Like (<span class="like-count">${data.like_count}</span>)`;
                    showNotification('Post unliked!', 'info');
                }
                
                // Add animation
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = 'pulse 0.3s ease';
                }, 10);
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error liking post!', 'error');
                this.innerHTML = `🤍 Like (<span class="like-count">${likeCount.textContent}</span>)`;
            })
            .finally(() => {
                this.classList.remove('loading');
            });
        });
    });
}

// Follow functionality
function initializeFollowButtons() {
    document.querySelectorAll('.follow-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const userId = this.dataset.userId;
            const originalText = this.textContent;
            
            // Add loading state
            this.classList.add('loading');
            this.innerHTML = '⏳ Loading...';
            
            fetch(`/follow/${userId}/`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.followed) {
                    this.classList.add('following');
                    this.textContent = '✅ Following';
                    showNotification('User followed!', 'success');
                } else {
                    this.classList.remove('following');
                    this.textContent = '👤 Follow';
                    showNotification('User unfollowed!', 'info');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error following user!', 'error');
                this.textContent = originalText;
            })
            .finally(() => {
                this.classList.remove('loading');
            });
        });
    });
}

// Comment functionality
function initializeCommentForms() {
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('.comment-input');
            const button = this.querySelector('button');
            const commentText = input.value.trim();
            
            if (!commentText) {
                showNotification('Please enter a comment!', 'error');
                input.focus();
                return;
            }
            
            // Add loading state
            button.classList.add('loading');
            button.innerHTML = '⏳ Posting...';
            
            // Simulate form submission
            setTimeout(() => {
                this.submit();
            }, 500);
        });
    });
}

// Post creation functionality
function initializePostForms() {
    const postForm = document.querySelector('.post-form');
    if (postForm) {
        const textarea = postForm.querySelector('.post-textarea');
        const submitBtn = postForm.querySelector('.post-submit');
        
        // Character counter
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            const counter = this.parentNode.querySelector('.char-counter') || 
                           createCharCounter(this.parentNode);
            counter.textContent = `${length}/500`;
            
            if (length > 500) {
                counter.style.color = '#f44336';
            } else if (length > 400) {
                counter.style.color = '#ff9800';
            } else {
                counter.style.color = '#4CAF50';
            }
            
            // Auto-resize textarea
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Add placeholder animation
        textarea.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        textarea.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
    }
}

// UI Enhancements
function enhanceUIInteractions() {
    // Add hover effects to cards
    document.querySelectorAll('.post, .user-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    document.querySelectorAll('button, .action-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Real-time features (simulated)
function setupRealTimeFeatures() {
    // Simulate real-time updates
    setInterval(() => {
        updateOnlineUsers();
        checkNewNotifications();
    }, 30000); // Every 30 seconds
    
    // Add typing indicator for comments
    document.querySelectorAll('.comment-input').forEach(input => {
        let typingTimer;
        
        input.addEventListener('input', function() {
            clearTimeout(typingTimer);
            this.parentNode.classList.add('typing');
            
            typingTimer = setTimeout(() => {
                this.parentNode.classList.remove('typing');
            }, 1000);
        });
    });
}

// Utility Functions
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
    `;
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    document.body.appendChild(notification);
}

function createCharCounter(container) {
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 12px;
        margin-top: 5px;
        color: #4CAF50;
    `;
    container.appendChild(counter);
    return counter;
}

function updateOnlineUsers() {
    // Simulate online users update
    const onlineCount = Math.floor(Math.random() * 50) + 1;
    const onlineElement = document.querySelector('.online-users');
    if (onlineElement) {
        onlineElement.textContent = `${onlineCount} users online`;
    }
}

function checkNewNotifications() {
    // Simulate notification check
    const hasNotifications = Math.random() > 0.7;
    if (hasNotifications) {
        showNotification('New activity in your network!', 'info');
    }
}

// CSS Animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .typing::after {
        content: '...';
        animation: typing 1s infinite;
    }
    
    @keyframes typing {
        0%, 20% { content: '.'; }
        40% { content: '..'; }
        60%, 100% { content: '...'; }
    }
    
    .char-counter {
        transition: color 0.3s ease;
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.SocialApp = {
    initializeApp,
    showNotification,
    getCookie
};

console.log('✅ Social Media App JavaScript loaded successfully!');