document.querySelector('#log-in-button').addEventListener('click', () => {
    document.querySelector('#login').style.display = 'block';
    document.querySelector('#sign-up').style.display = 'none';
});

document.querySelector('#cancel-login').addEventListener('click', () => {
    document.querySelector('#login').style.display = 'none';
});

document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const loginEmail = document.querySelector('#login-email').value;
    const loginPass = document.querySelector('#login-pass').value;

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

            document.querySelector('#join-us').innerHTML = `welcome, ${data.username}`;
            document.querySelector('#log-in-button').style.display = 'none';
            document.querySelector('#log-out-button').style.display = 'inline';
            document.querySelector('#login-form').style.display = 'none';
            if (data.setter == true) document.querySelector('#add-problem').style.display = 'block';

        });
});

document.querySelector('#join-us').addEventListener('click', () => {
    document.querySelector('#sign-up').style.display = 'block';
    document.querySelector('#login').style.display = 'none';
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
    if (signUpPass !== confirmPass) alert('Ooooops! Your passwords do not match!');

    fetch('/users/join', {
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

            document.querySelector('#sign-up').style.display = 'none';
            document.querySelector('#join-us').innerHTML = `welcome, ${data}`;
            document.querySelector('#log-in-button').style.display = 'none';
            document.querySelector('#log-out-button').style.display = 'inline';

        });
})

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

            document.querySelector('#join-us').innerHTML = `welcome, ${data.username}`;
            document.querySelector('#log-in-button').style.display = 'none';
            document.querySelector('#log-out-button').style.display = 'inline';
            document.querySelector('#login-form').style.display = 'none';
            if (data.setter == true) document.querySelector('#add-problem').style.display = 'block';
        
        });         
});
