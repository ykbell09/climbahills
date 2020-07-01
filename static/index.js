/**
 * Updates the page display if the user is logged in.
 * @param {object} user 
 */
const loggedInDisplay = user => {
    const topNavUser = document.querySelector('#top-nav-user');
    const userWelcome = document.createElement('p');
    // userWelcome.className = '';
    userWelcome.innerHTML = `welcome, ${user.username}`;
    topNavUser.insertBefore(userWelcome, topNavUser.childNodes[0]);

    document.querySelector('#sign-up-link').style.display = 'none';
    document.querySelector('#log-in-button').style.display = 'none';
    document.querySelector('#log-out-button').style.display = 'inline';
    document.querySelector('#login').style.display = 'none';
    document.querySelector('#sign-up').style.display = 'none';

    if (user.setter == true) document.querySelector('#add-problem').style.display = 'block';

};

/**
 * Checks for any inserted response alerts and removes them.
 */
const clearAlertIfExists = () => {
    if (document.querySelector('.login-alert') !== null) document.querySelector('.login-alert').remove();
};

/**
 * Checks for any inserted response messages and removes them.
 */
const clearMessageIfExists = () => {
    if (document.querySelector('.reset-msg') !== null) document.querySelector('.reset-msg').remove();
};

document.querySelector('#log-in-button').addEventListener('click', () => {
    document.querySelector('#login').style.display = 'block';
    document.querySelector('#sign-up').style.display = 'none';
    document.querySelector('#forgot-pass').style.display = 'none';
});

document.querySelector('#cancel-login').addEventListener('click', () => {
    clearAlertIfExists();
    document.querySelector('#login').style.display = 'none';
});

document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const loginEmail = document.querySelector('#login-email').value;
    const loginPass = document.querySelector('#login-pass').value;

    clearAlertIfExists();

    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: loginEmail,
            password: loginPass
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.username !== null) {
                loggedInDisplay(data);
            } else {
                const loginForm = document.querySelector('#login-form');
                const loginAlert = document.createElement('p');
                loginAlert.className = 'login-alert';
                loginAlert.innerHTML = 'Sorry, that email or password is not correct.'
                loginForm.appendChild(loginAlert);
            }
        });
});

document.querySelector('#sign-up-link').addEventListener('click', () => {
    document.querySelector('#sign-up').style.display = 'block';
    document.querySelector('#login').style.display = 'none';
    document.querySelector('#forgot-pass').style.display = 'none';
});

document.querySelector('#cancel-signup').addEventListener('click', () => {
    document.querySelector('#sign-up').style.display = 'none';
});

document.querySelector('#sign-up-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const signUpName = document.querySelector('#sign-up-name').value;
    const signUpEmail = document.querySelector('#sign-up-email').value;
    const signUpPass = document.querySelector('#sign-up-pass').value;
    const confirmPass = document.querySelector('#confirm-pass').value;

    clearAlertIfExists();

    if (signUpPass !== confirmPass) {
        const signUpForm = document.querySelector('#sign-up-form');
        const signUpAlert = document.createElement('p');
        signUpAlert.className = 'login-alert';
        signUpAlert.innerHTML = 'Please check your passwords and try again.';
        signUpForm.appendChild(signUpAlert);
    } else {
        fetch('/users/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: signUpName,
                email: signUpEmail,
                password: signUpPass
            })
        })
            .then(response => response.json())
            .then(data => {

                if (data.username !== null) {
                    loggedInDisplay(data);
                } else {
                    const signUpForm = document.querySelector('#sign-up-form');
                    const signUpAlert = document.createElement('p');
                    signUpAlert.className = 'login-alert';
                    signUpAlert.innerHTML = 'There is already an account associated with this email.'
                    signUpForm.appendChild(signUpAlert);
                }
            });
    }
});

document.querySelector('#log-out-button').addEventListener('click', () => {
    fetch('/users/logout', {
        method: 'POST'
    })
        .then(window.location.href = '/index.html');
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('/users/reload', {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.username != undefined || null) loggedInDisplay(data);
        });
});

document.querySelector('#forgot-pass-link').addEventListener('click', () => {
    document.querySelector('#forgot-pass').style.display = 'block';
    document.querySelector('#login').style.display = 'none';
});

document.querySelector('#cancel-forgot-pass').addEventListener('click', () => {
    document.querySelector('#forgot-pass').style.display = 'none';
    if (document.querySelector('.reset-msg') !== null) document.querySelector('.reset-msg').remove();
});

// send forgot password email
document.querySelector('#forgot-pass').addEventListener('submit', (e) => {
    e.preventDefault();
    const userEmail = document.querySelector('#forgot-pass-email').value;

    fetch('/users/forgot-pass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: userEmail
        })
    })
        .then(response => response.json())
        .then(data => {

            clearMessageIfExists();
            
            if (data.success !== false) {
                const message = document.querySelector('#forgot-pass-msg');
                const successMsg = document.createElement('p');
                successMsg.innerHTML = 'success! check your email';
                successMsg.className = 'reset-msg';
                message.appendChild(successMsg);
                document.querySelector('#send-email-submit').disabled = true;
            } else {
                const message = document.querySelector('#forgot-pass-msg');
                const failedMsg = document.createElement('p');
                failedMsg.innerHTML = 'there is no account associated with that email';
                failedMsg.className = 'reset-msg';
                message.appendChild(failedMsg);
                const signUpLink = document.createElement('p');
                signUpLink.innerHTML = 'sign up!';
                signUpLink.id = 'reset-msg-link';
                failedMsg.appendChild(signUpLink);
                
                document.querySelector('#reset-msg-link').addEventListener('click', () => {
                    document.querySelector('#forgot-pass').style.display = 'none';
                    document.querySelector('#sign-up').style.display = 'block';
                });
            }
        });
});