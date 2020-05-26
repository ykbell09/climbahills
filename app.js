import express from 'express';
import {getAllProblems} from './services/functions.js';

const app = express();


// // EXAMPLE API
// app.get('/api/getGins/:location', (request, response) => {
//     const { state_located } = request.params || {};
//     const gins = checkLocation(state_located);
//     response.json(gins);
// });

app.get('/api/problems', async (request, response) => {
    const allProblems = await getAllProblems();
    return response.json(allProblems);
});


// STATIC ROUTES
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
// const PORT = 8000;
// app.listen(PORT, () =>
//     console.log(`listening on port ${PORT} -- YOU CAN DO THIS!`));

// DEPLOY CODE
app.listen(process.env.PORT, () =>
    console.log(`listening on port ${process.env.PORT}`)
);