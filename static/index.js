// document.querySelector('#climb-on').addEventListener('click', () => fetch('/problems')
//     .then(response => response.json()) // returns response as json data
//     .then(data => {

//         console.log(data);

//     })
// );

// LOGIN FORM CODE
document.querySelector('#log-in-button').addEventListener('click', () => {
    document.querySelector('#login').style.display = 'block';
    document.querySelector('#sign-up').style.display = 'none';
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
        
            // show welcome message -- change this to add element in topnav
            document.querySelector('#join-us').innerHTML = `welcome, ${data.username}`;

            // show log out button
            document.querySelector('#log-in-button').style.display = 'none';
            document.querySelector('#log-out-button').style.display = 'inline';

            console.log(data);
            
        });


});

document.querySelector('#cancel-login').addEventListener('click', () => {
    document.querySelector('#login').style.display = 'none';
});

// SIGN UP FORM CODE
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

    fetch('/users', {
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
        .then(response => {
            console.log(response);
            const test = response.json();
            console.log(test);
        })
        
        .then(data => {

            console.log(data);
            
            // hide join us link
            document.querySelector('#sign-up').style.display = 'none';
            
            // show welcome message -- change this to add element in topnav
            document.querySelector('#join-us').innerHTML = `welcome, ${data}`;

            // show log out button
            document.querySelector('#log-in-button').style.display = 'none';
            document.querySelector('#log-out-button').style.display = 'inline';

            // sheck setter status and if true, show add problem button
            
            
        });



})
