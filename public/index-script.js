const popupContainer = document.querySelector("section");
        const showSignupForm = document.querySelector(".signup-btn-show");
        const showLoginForm = document.querySelector(".login-btn-show");
        const signupCloseBtn = document.getElementById("signup-cancel");
        const loginCloseBtn = document.getElementById("login-cancel");
        const signupForm = document.getElementById("signup-form");
        const loginForm = document.getElementById("login-form");
        const formNotif = document.getElementById('form-notif');
    
        showSignupForm.addEventListener("click", () => popupContainer.classList.add("signup-active"));
        showLoginForm.addEventListener("click", () => popupContainer.classList.add("login-active"));
        signupCloseBtn.addEventListener("click", () => popupContainer.classList.remove("signup-active"));
        loginCloseBtn.addEventListener("click", () => popupContainer.classList.remove("login-active"));
    
        document.addEventListener('DOMContentLoaded', function() {
            signupForm.addEventListener('submit', function(event) {
                event.preventDefault();
    
                const usernameInput = document.getElementById('username-signup');
                const emailInput = document.getElementById('email-signup');
                const passwordInput = document.getElementById('password-signup');
                const password2Input = document.getElementById('reenter-password');
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                let isValidEmail = emailPattern.test(emailInput.value);
    
                formNotif.innerHTML = '';
    
                let notificationTimeout;
    
                function showNotification(message) {
                    formNotif.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>${message}`;
                    clearTimeout(notificationTimeout);
                    notificationTimeout = setTimeout(() => {
                        formNotif.innerHTML = '';
                        popupContainer.classList.remove("notif-active");
                    }, 5400);
                };
    
                if (usernameInput.value === '' && emailInput.value === '' && passwordInput.value === '' && password2Input.value === '') {
                    popupContainer.classList.add("notif-active");
                    showNotification('Please fill in the fields to sign up');
                    return;
                };
    
                if (usernameInput.value === '') {
                    popupContainer.classList.add("notif-active");
                    showNotification('Please enter your new username');
                    return;
                };
    
                if (emailInput.value === '') {
                    popupContainer.classList.add("notif-active");
                    showNotification('Please enter your email');
                    return;
                };
    
                if (!isValidEmail) {
                    popupContainer.classList.add("notif-active");
                    showNotification('Invalid email');
                    return;
                };
    
                if (passwordInput.value === '') {
                    popupContainer.classList.add("notif-active");
                    showNotification('Please enter your new password');
                    return;
                };
    
                if (passwordInput.value.length < 8) {
                    popupContainer.classList.add("notif-active");
                    showNotification('The password must have at least 8 characters');
                    return;
                };
    
                if (password2Input.value === '') {
                    popupContainer.classList.add("notif-active");
                    showNotification('Please reenter your new password');
                    return;
                };
    
                if (password2Input.value !== passwordInput.value) {
                    popupContainer.classList.add("notif-active");
                    showNotification('Passwords do not match. Try again');
                    return;
                };
    
                signupForm.submit();
                popupContainer.classList.remove("signup-active");
            });
        });
    
        document.addEventListener('DOMContentLoaded', function() {
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault();
    
                const usernameInputs = document.getElementById("username-login");
                const passwordInputs = document.getElementById("password-login");
    
                formNotif.innerHTML = '';
    
                let notificationTimeout;
    
                function showNotification(message) {
                    formNotif.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>${message}`;
                    clearTimeout(notificationTimeout);
                    setTimeout(() => {
                        formNotif.innerHTML = '';
                        popupContainer.classList.remove("notif-active");
                    }, 5400);
                };
    
                if (usernameInputs.value === '' && passwordInputs.value === '') {
                    showNotification('Please fill in the fields to login');
                    return;
                };
    
                if (usernameInputs.value === '') {
                    showNotification('Please enter your username');
                    return;
                };
    
                if (passwordInputs.value === '') {
                    showNotification('Please enter your password');
                    return;
                };
    
                loginForm.submit();
                popupContainer.classList.remove("login-active");
            });
        });