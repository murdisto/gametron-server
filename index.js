'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: userRouter } = require('./users');
const { router: gameRouter } = require('./games');
const { router: postRouter } = require('./posts');
const { router: imageRouter } = require('./images/router');

const { router: emailRouter } = require('./email');

const app = express();
const jsonParser = bodyParser.json();

app.use(
	morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
		skip: (req, res) => process.env.NODE_ENV === 'test',
	})
);

app.use(
	cors({
		origin: '*',
	})
);

//image post
app.use(jsonParser);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/games', gameRouter);
app.use('/posts', postRouter);
app.use('/image-upload', imageRouter);

app.use('/email', emailRouter);

function runServer(port = PORT) {
	const server = app
		.listen(port, () => {
			console.info(`App listening on port ${server.address().port}`);
		})
		.on('error', (err) => {
			console.error('Express failed to start');
			console.error(err);
		});
}

if (require.main === module) {
	dbConnect();
	runServer();
}

module.exports = { app };
