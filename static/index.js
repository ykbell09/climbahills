document.querySelector('#climb-on').addEventListener('click', () => fetch('/api/problems')
    .then(response => response.json()) // returns response as json data
    .then(data => {

        console.log(data);

    })
);