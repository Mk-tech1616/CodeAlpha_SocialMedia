// Like functionality with AJAX
document.addEventListener('DOMContentLoaded', function() {
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.dataset.postId;
            const likeCount = this.querySelector('.like-count');
            
            fetch(`/like_post/${postId}/`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.liked) {
                    this.classList.add('liked');
                } else {
                    this.classList.remove('liked');
                }
                likeCount.textContent = data.like_count;
            })
            .catch(error => console.error('Error:', error));
        });
    });

    // Follow buttons
    document.querySelectorAll('.follow-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.dataset.userId;
            
            fetch(`/follow/${userId}/`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.followed) {
                    this.classList.add('following');
                    this.textContent = 'Following';
                } else {
                    this.classList.remove('following');
                    this.textContent = 'Follow';
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });

    // Add placeholder to registration form fields
    const usernameField = document.querySelector('#id_username');
    const password1Field = document.querySelector('#id_password1');
    const password2Field = document.querySelector('#id_password2');
    
    if (usernameField) usernameField.placeholder = 'Username';
    if (password1Field) password1Field.placeholder = 'Password';
    if (password2Field) password2Field.placeholder = 'Confirm Password';
});

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