import express from 'express';
import _ from './env';
import knex from './database';
import session from 'express-session';
import ConnectSessionKnex from 'connect-session-knex';
import { addNewUser, checkPassHash, sendPassResetEmail, getUserKeyAndExpiration, compareDates, compareKeys, updateUserPassword, deleteResetRecord } from './services/functions.js';

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

app.post('/users/login', async (req, res) => {
    req.session.regenerate( async (err) => { // super important for security!
        const user = req.body;
        const userObject = await checkPassHash(user.email, user.password);
        if (userObject == null) {
            res.send({ user: null });
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
        res.send({ user: null });
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
    res.send(req.session.user);
});

app.post('/users/logout', function (req, res) {
    req.session.destroy((err) => {
        res.end();
    });
});

const staticRoute = express.static('static');
app.use('/', staticRoute);
app.use('/static', staticRoute);

// GLOBAL ERROR HANDLER
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