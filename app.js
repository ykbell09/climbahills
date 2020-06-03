import express from 'express';
import knex from './database';
import session from 'express-session';
import ConnectSessionKnex from 'connect-session-knex';
import { addNewUser, checkPassHash } from './services/functions.js';

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
    secret: '$2b$10$2wyQTyw4vsK40hq7AnVguboKTLbEnrzh',
    sameSite: true
}));

app.post('/users/join', async (req, res) => {
    const newUser = req.body;
    req.session.username = await addNewUser(newUser.username, newUser.email, newUser.password);
    const response = { username: req.session.username };
    res.send(response);
});

app.post('/users/login', async (req, res) => {
    req.session.regenerate( async (err) => { // super important for security!
        const user = req.body;
        req.session.username = await checkPassHash(user.email, user.password);
        const response = { username: req.session.username };
        res.send(response);
    }); 
});

app.post('/logout', function (req, res) {
    req.session.destroy((err) => {
        res.end('/');
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

// LOCAL PORT 
const PORT = 8000;
app.listen(PORT, () =>
    console.log(`listening on port ${PORT} -- YOU CAN DO THIS!`));

// DEPLOY CODE
// app.listen(process.env.PORT, () =>
//     console.log(`listening on port ${process.env.PORT}`)
// );