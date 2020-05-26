// document.querySelector('#climb-on').addEventListener('click', () => fetch('/api/problems')
//     .then(response => response.json()) // returns response as json data
//     .then(data => {

//         console.log(data);

//     })
// );

document.querySelector('#climb-on').addEventListener('click', () => {
    document.querySelector('#login').style.display = 'block';
});

document.querySelector('#cancel-button').addEventListener('click', () => {
    document.querySelector('#login').style.display = 'none';
});