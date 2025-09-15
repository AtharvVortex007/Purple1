document.addEventListener('DOMContentLoaded', function() {
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    // A list of all your protected pages
    const protectedPages = [
        'courses.html', 'password-security.html', 'phishing-awareness.html', 
        'secure-browsing.html', 'data-privacy.html', 'social-media-security.html',
        'ransomware-response.html', 'mobile-security.html', 'iot-security.html',
        'cloud-security.html', 'cybersecurity-culture.html', 'digital-forensics.html',
        'ethical-hacking-intro.html', 'wifi-security.html'
    ];

    // Get UI elements
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfoDiv = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    const loginTriggerButtons = document.querySelectorAll('.login-trigger-btn');

    // Function to handle the sign-in process
    const handleSignIn = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
                window.location.href = 'courses.html';
            })
            .catch((error) => {
                console.error("Error during sign-in:", error);
            });
    };
    
    // Attach the sign-in handler to the main login button in the header
    if (loginBtn) {
        loginBtn.addEventListener('click', handleSignIn);
    }

    // Attach login logic to course buttons and the floating action button
    loginTriggerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const user = auth.currentUser;
            if (user) {
                window.location.href = 'courses.html';
            } else {
                handleSignIn();
            }
        });
    });

    // Logout Function
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                window.location.href = 'index.html';
            }).catch((error) => {
                console.error("Error during sign-out:", error);
            });
        });
    }
    
    // Auth State Observer (The Gatekeeper)
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed IN
            if (userInfoDiv && userNameSpan && loginBtn) {
                userInfoDiv.style.display = 'flex';
                userNameSpan.textContent = user.displayName;
                loginBtn.style.display = 'none';
            }
        } else {
            // User is signed OUT
            if (userInfoDiv && loginBtn) {
                userInfoDiv.style.display = 'none';
                loginBtn.style.display = 'block';
            }
            const currentPage = window.location.pathname.split('/').pop();
            if (protectedPages.includes(currentPage)) {
                window.location.href = 'index.html';
            }
        }
    });

    // Logic for collapsible quiz buttons on course pages
    const quizToggleBtns = document.querySelectorAll('.quiz-toggle-btn');
    quizToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const quizContent = btn.nextElementSibling;
            if (quizContent.style.maxHeight) {
                quizContent.style.maxHeight = null;
                quizContent.style.padding = "0 20px";
            } else {
                quizContent.style.maxHeight = quizContent.scrollHeight + 40 + "px";
                quizContent.style.padding = "20px";
            }
        });
    });

    // Logic for showing quiz answers
    const showAnswersBtns = document.querySelectorAll('.show-answers-btn');
    showAnswersBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const quiz = btn.closest('.quiz-content');
            const correctAnswers = quiz.querySelectorAll('label[data-correct="true"]');
            correctAnswers.forEach(answer => {
                answer.classList.add('correct-answer');
                const radio = answer.querySelector('input[type="radio"]');
                if (radio) { radio.checked = true; }
            });
        });
    });
});