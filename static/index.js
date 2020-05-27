// document.querySelector('#climb-on').addEventListener('click', () => fetch('/api/problems')
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


