/**
 * Inserts form response message depending on user action sucess or failure.
 * @param {string} message 
 */
const displayResetMsg = (message) => {
    const resetPassForm = document.querySelector('#reset-pass-form');
    const resetPassAlert = document.createElement('p');
    resetPassAlert.className = 'reset-msg';
    resetPassAlert.innerHTML = message;
    resetPassForm.appendChild(resetPassAlert);
};

/**
 * Checks for any inserted response messages and removes them.
 */
const clearMessageIfExists = () => {
    if (document.querySelector('.reset-msg') !== null) document.querySelector('.reset-msg').remove();
};

document.querySelector('#reset-pass-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#reset-pass-email').value;
    const key = document.querySelector('#key').value;
    const newPassword = document.querySelector('#reset-pass-pass').value;
    const confirmPass = document.querySelector('#reset-pass-confirm').value;

    clearMessageIfExists();

    if (newPassword !== confirmPass) {
        displayResetMsg('Please check your password and try again.');
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

                clearMessageIfExists();

                if (data.success == true) {
                    displayResetMsg('Success! Your password has been updated.');
                } else {
                    displayResetMsg('Please check your credentials and try again.');
                }

            });
    }
});