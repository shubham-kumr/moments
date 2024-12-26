document.addEventListener('DOMContentLoaded', () => {
    const googleLoginBtn = document.getElementById('googleLogin');

    googleLoginBtn.addEventListener('click', async () => {
        try {
            googleLoginBtn.disabled = true;
            googleLoginBtn.textContent = 'Signing in...';

            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await firebase.auth().signInWithPopup(provider);

            if (result.user) {
                const idToken = await result.user.getIdToken();
                
                const response = await fetch('/auth/verify-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: idToken })
                });

                const data = await response.json();
                if (data.success) {
                    window.location.replace('/dashboard');
                } else {
                    throw new Error(data.error || 'Login failed');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = error.message;
            googleLoginBtn.parentNode.appendChild(errorDiv);
        } finally {
            googleLoginBtn.disabled = false;
            googleLoginBtn.innerHTML = `
                <img src="https://www.google.com/favicon.ico" alt="Google" class="google-icon">
                Continue with Google
            `;
        }
    });
}); 