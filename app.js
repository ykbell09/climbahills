import express from 'express';
import _ from './env';
import knex from './database';
import session from 'express-session';
import ConnectSessionKnex from 'connect-session-knex';
import { addNewUser, checkPassHash, sendPassResetEmail, getUserKeyAndExpiration, compareDates, compareKeys, updateUserPassword, deleteResetRecord, deleteUserRecord, updateUserStatus } from './services/functions.js';
import { addNewProblem, getCurrentProblems } from './services/problems';

const app = express();
app.use(express.json());

// sessions middleware
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const KnexSessionStore = ConnectSessionKnex(session);
const store = new KnexSessionStore({ knex });
app.use(session({
    store,
    cookie: { maxAge: ONE_WEEK },
    resave: false,
    saveUninitialized: true,
    secret: process.env.KNEX_SESSION_STORE_SECRET,
    sameSite: true
}));

// user APIs
app.post('/users/login', async (req, res) => {
    req.session.regenerate( async (err) => { // super important for security!
        const user = req.body;
        const userObject = await checkPassHash(user.email, user.password);
        if (userObject == null) {
            res.send({ username: null });
        } else {
            req.session.user = userObject;
            res.send(userObject);
        }
    }); 
});

app.post('/users/sign-up', async (req, res) => {
    const newUser = req.body;
    const userObject = await addNewUser(newUser.username, newUser.email, newUser.password);
    if (userObject == null) {
        res.send({ username: null });
    } else {
        req.session.user = userObject;
        res.send(userObject);
    }
});

app.post('/users/forgot-pass', async (req, res) => {
    const user = req.body;
    const emailResult = await sendPassResetEmail(user.email);
    if (emailResult == null) {
        res.send({ success: false });
    } else {
        res.send({ success: true });
    }
});

app.post('/users/reset-pass', async (req, res) => {
    const resetInfo = req.body;
    const userInfo = await getUserKeyAndExpiration(resetInfo.email);

    if (userInfo == undefined) {
        res.send({ success: false });
        return;
    }

    const expired = compareDates(userInfo.expiration);
    const keysMatch = compareKeys(resetInfo.key, userInfo.key);

    if (userInfo == null || expired == true || keysMatch == false) {
        res.send({ success: false })
    } else {
        const userName = await updateUserPassword(userInfo.user_id, resetInfo.password);
        await deleteResetRecord(userInfo.user_id);
        res.send({ success: true, user: userName });
    }
});

app.post('/users/reload', async (req, res) => {  
    if (req.session.user != undefined) {
        res.send({ username: req.session.user.username, setter: req.session.user.setter, admin: req.session.user.admin });
    }
});

app.post('/users/logout', function (req, res) {
    req.session.destroy((err) => {
        res.end();
    });
});

// admin APIs
app.post('/users/delete', async (req, res) => {
    const userEmail = req.body.userEmail;
    const result = await deleteUserRecord(userEmail);
    res.send({ success: result });
});

app.post('/users/update', async (req, res) => {
    const user = req.body;
    const result = await updateUserStatus(user.email, user.setter, user.admin);
    res.send({ success: result });
});

// problems APIs
app.post('/problems/add', async (req, res) => {
    const problem = req.body;
    const result = await addNewProblem(
        problem.name,
        problem.fa,
        problem.setter,
        problem.grade,
        problem.plusMinus,
        problem.dateSet,
        problem.dateRemoved,
        problem.tapeColor,
        problem.notes
    );

    res.send({ success: result });
});

app.get('/problems', async (req, res) => {
    const allProblems = await getCurrentProblems();
    res.send(allProblems);
});



const staticRoute = express.static('static');
app.use('/', staticRoute);
app.use('/static', staticRoute);

// GLOBAL ERROR HANDLER - TO BE REVIEWED
const { NODE_ENV } = process.env;
// COMMENT OUT IF STATEMENT FOR TESTING
if (NODE_ENV !== 'development' && NODE_ENV !== 'test') {
    app.use(function (err, req, res, next) {
        console.error(err);
        // then:
        res.status(500).send({
            error: 'GENERIC',
            description: 'Something went wrong. Please try again later.',
        });
        // or:
        // res.send(errPageHTML);
    })
};

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
    console.log(`listening on port ${PORT} -- YOU\'RE TOTALLY DOING THIS!`)
);