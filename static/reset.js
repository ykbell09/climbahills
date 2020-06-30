document.querySelector('#reset-pass-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#reset-pass-email').value;
    const key = document.querySelector('#key').value;
    const newPassword = document.querySelector('#reset-pass-pass').value;
    const confirmPass = document.querySelector('#reset-pass-confirm').value;
    if (document.querySelector('.form-msg') !== null) document.querySelector('.form-msg').remove();

    if (newPassword !== confirmPass) {
        const resetPassForm = document.querySelector('#reset-pass-form');
        const resetPassAlert = document.createElement('p');
        resetPassAlert.className = 'form-msg';
        resetPassAlert.innerHTML = 'Please check your passwords and try again.';
        resetPassForm.appendChild(resetPassAlert);
    } else {
        fetch('/users/reset-pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                key: key,
                password: newPassword
            })
        })
            .then(response => response.json())
            .then(data => {
            

                console.log(data);
            
            
            });
    }
});