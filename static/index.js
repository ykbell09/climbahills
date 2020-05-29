// document.querySelector('#climb-on').addEventListener('click', () => fetch('/problems')
//     .then(response => response.json()) // returns response as json data
//     .then(data => {

//         console.log(data);

//     })
// );

// LOGIN FORM CODE
document.querySelector('#climb-on').addEventListener('click', () => {
    document.querySelector('#login').style.display = 'block';
});

document.querySelector('#cancel-login').addEventListener('click', () => {
    document.querySelector('#login').style.display = 'none';
});

// SIGN UP FORM CODE
document.querySelector('#join-us1').addEventListener('click', () => {
    document.querySelector('#sign-up').style.display = 'block';
});

document.querySelector('#join-us2').addEventListener('click', () => {
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
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });



})
