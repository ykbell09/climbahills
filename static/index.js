/**
 * Updates the page display if the user is logged in.
 * @param {object} user 
 */
const loggedInDisplay = user => {
    const topNavUser = document.querySelector('#top-nav-user');
    const userWelcome = document.createElement('p');
    userWelcome.innerHTML = `welcome, ${user.username}`;
    topNavUser.insertBefore(userWelcome, topNavUser.childNodes[0]);

    document.querySelector('#sign-up-link').style.display = 'none';
    document.querySelector('#log-in-button').style.display = 'none';
    document.querySelector('#log-out-button').style.display = 'inline';
    document.querySelector('#login').style.display = 'none';
    document.querySelector('#sign-up').style.display = 'none';
    document.querySelector('#add-problem-div').style.display = 'none';

    if (user.setter === true) document.querySelector('#add-problem-div').style.display = 'block';
    if (user.setter === true) document.querySelector('#your-problems').style.display = 'block';
    if (user.admin === true) document.querySelector('#admin-button').style.display = 'inline';

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

// gets and displays all current problems on page load
const displayCurrentProblemSet = (problems) => {
    console.log(problems[1]);

    if (problems.length > 0) {

        for (let i = 0; i < problems.length; i++) {
            // create a new problem card
            const name = problems[i].name;
            let grade = problems[i].grade;
            if (problems[i].plus_minus !== undefined) {
                grade = grade + problems[i].plus_minus;
            }
            const setter = problems[i].setter;
            const fa = problems[i].fa;
            const notes = problems[i].notes;
            const color = problems[i].tape_color;
            
            const problemCard = document.createElement('div');
            problemCard.className = `problem-card ${color}-color`;
            problemCard.innerHTML = `<div class="card-content">
            <h2>v${grade}</h2>
            <h4>${name}</h4>
            <p><span class="problem-card-heading">SETTER:</span> ${setter}
            <br />
            <span class="problem-card-heading">FA:</span> ${fa}</p>
            <p><span class="problem-card-heading">NOTES:</span> ${notes}</p>
            </div>`

            const problemList = document.querySelector('#problem-list');
            problemList.appendChild(problemCard);

            console.log(problemCard.className);

        }
    }
};

// event listeners inserted on page load
document.addEventListener('DOMContentLoaded', () => {

    // check if user is logged in
    fetch('/users/reload', { method: 'POST' })
        .then(response => response.json())
        .then(data => { if (data.username !== undefined || null) loggedInDisplay(data); });

    // get all current problems
    fetch('/problems', { method: 'GET' })
        .then(response => response.json())
        .then(data => { displayCurrentProblemSet(data); });

    // add all DOM event listeners -- refactor code!


});

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

// admin events

document.querySelector('#admin-button').addEventListener('click', () => {
    document.querySelector('#admin').style.display = 'block';
    document.querySelector('#are-you-sure').style.display = 'none';
});

document.querySelector('#cancel-delete').addEventListener('click', () => {
    document.querySelector('#admin').style.display = 'none';
    document.querySelector('#are-you-sure').style.display = 'none';
});

document.querySelector('#cancel-admin').addEventListener('click', () => {
    document.querySelector('#admin').style.display = 'none';
    document.querySelector('#are-you-sure').style.display = 'none';
    clearMessageIfExists();
});

document.querySelector('#cancel-delete').addEventListener('click', () => {
    document.querySelector('#are-you-sure').style.display = 'none';
    document.querySelector('#admin').style.display = 'block';
    document.querySelector('#are-you-sure-submit').style.display = 'block';
    clearMessageIfExists();

});

// admin delete user -- needs work
document.querySelector('#admin-delete-user').addEventListener('click', () => {
    const userEmail = document.querySelector('#admin-email').value;
    if (userEmail == '') {
        clearMessageIfExists();
        const adminForm = document.querySelector('#admin');
        const updateAlert = document.createElement('p');
        updateAlert.className = 'reset-msg';
        updateAlert.innerHTML = 'Please enter a valid email.'
        adminForm.appendChild(updateAlert);
    } else {

        clearMessageIfExists();

        document.querySelector('#are-you-sure').style.display = 'block';
        document.querySelector('#admin').style.display = 'none';
        document.querySelector('#user-delete-warning').innerHTML = userEmail;

        const areYouSureSubmit = document.querySelector('#are-you-sure-submit');

        areYouSureSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            // call api, check record exists, delete & send {success: true}, display success message
            fetch('/users/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/jason'
                },
                body: JSON.stringify({
                    userEmail: userEmail
                })
            })
                .then(response => response.json())
                .then(data => {
                    areYouSureSubmit.style.display = 'none';

                    if (data.success == false) {
                        clearMessageIfExists();

                        const adminForm = document.querySelector('#are-you-sure');
                        const updateAlert = document.createElement('p');
                        updateAlert.className = 'reset-msg';
                        updateAlert.innerHTML = 'There is no account associated with this email.'
                        adminForm.appendChild(updateAlert);
                    }

                    if (data.success == true) {
                        clearMessageIfExists();

                        const adminForm = document.querySelector('#are-you-sure');
                        const updateAlert = document.createElement('p');
                        updateAlert.className = 'reset-msg';
                        updateAlert.innerHTML = 'Success! This account has been permanently deleted.'
                        adminForm.appendChild(updateAlert);

                        // update cancel button to 'close'
                    }



                });
        });
    }
});

// admin update user -- needs work
document.querySelector('#admin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const userEmail = document.querySelector('#admin-email').value;
    const setterStatusTrue = document.querySelector('#setter-true').checked;
    const setterStatusFalse = document.querySelector('#setter-false').checked;
    const adminStatusTrue = document.querySelector('#admin-true').checked;
    const adminStatusFalse = document.querySelector('#admin-false').checked;

    const statusUpdateTest = (x, y) => {
        if (x === true) {
            return true;
        } else if (y === true) {
            return false;
        } else {
            return null
        }
    };

    const setterStatus = statusUpdateTest(setterStatusTrue, setterStatusFalse);
    const adminStatus = statusUpdateTest(adminStatusTrue, adminStatusFalse);

    fetch('/users/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: userEmail,
            setter: setterStatus,
            admin: adminStatus
        })
    })
        .then(response => response.json())
        .then(data => {

            if (data.success == true) {
                clearMessageIfExists();

                const adminForm = document.querySelector('#admin-form');
                const updateAlert = document.createElement('p');
                updateAlert.className = 'reset-msg';
                updateAlert.innerHTML = 'Success! The user has been updated.'
                adminForm.appendChild(updateAlert);
            }

            if (data.success == false) {
                clearMessageIfExists();

                const adminForm = document.querySelector('#admin-form');
                const updateAlert = document.createElement('p');
                updateAlert.className = 'reset-msg';
                updateAlert.innerHTML = 'There was a problem updating this account or no account exists.'
                adminForm.appendChild(updateAlert);
            }


        });

});

// problem functions & events

// add a new problem
document.querySelector('#add-problem-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // collect form data values of fields
    const name = document.querySelector('#new-problem-name').value;
    const fa = document.querySelector('#new-first-ascent').value;
    const setter = document.querySelector('#new-setter-name').value;
    const grade = document.querySelector('#new-v-grade').value;

    const gradePlus = document.querySelector('#v-grade-plus').checked;
    const gradeMinus = document.querySelector('#v-grade-minus').checked;

    const plusMinus = (function () {
        if (gradePlus === true && gradeMinus === true) {
            alert('please select only plus or minus, not both');
        } else if (gradePlus === true) {
            return '+';
        } else if (gradeMinus === true) {
            return '-';
        } else {
            return '';
        }
    }());

    // convert a string date to date object
    const getDate = (input) => {
        if (input === '') {
            return undefined;
        } else {
            const array = input.split('-');
            const year = array[0];
            const month = array[1] - 1;
            const day = array[2];
            const date = new Date(year, month, day);
            return date;
        }
    };

    const dateSet = getDate(
        document.querySelector('#new-date-set').value
    );
    const dateRemoved = getDate(
        document.querySelector('#new-date-removed').value
    );
    const tapeColor = document.querySelector('#tape-color').value;
    const notes = document.querySelector('#problem-notes').value;

    // problem object
    const problem = {
        name: name,
        fa: fa,
        setter: setter,
        grade: grade,
        plusMinus: plusMinus,
        dateSet: dateSet,
        dateRemoved: dateRemoved,
        tapeColor: tapeColor,
        notes: notes
    };

    if (problem.plusMinus !== undefined) {

        fetch('/problems/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                problem
            )
        })
            .then(response => response.json())
            .then(data => {

                if (data.success === true) {
                    // display confirmation a <p> at end of form
                    alert('problem successfully added!')
                    addProblemForm.reset();
                }

                if (data.success === false) {
                    alert('Please make sure all required fields are completed.')
                    // display error message
                    // problem with same name? 
                    // other error?
                }

            });




    }
});



