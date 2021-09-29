const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const session = require('cookie-session');
const compression = require('compression');
dotenv.config({ path: './config/config.env' }); // read config.env to environmental variables
require('./config/dbConnection')(); // db connection

const { errorHandler, AppError } = require('@utils/tdb_globalutils');

const ticketRoutes = require('./constants/consts').routeConsts.ticketRoute;
const ticketRouter = require('./routes/ticketRoutes');

const PORT = 3002; // port
const app = express();

// CORS
app.use(cors());

app.use(morgan('dev'));

// GLOBAL MIDDLEWARES
app.use(express.json()); // body parser (reading data from body to req.body)
//app.use(cookieParser()); // cookie parser (reading data from cookie to req.cookie)
app.use(
	session({
		signed: false,
	})
);

app.use(compression());

//routes
app.use(ticketRoutes, ticketRouter);
app.all('*', (req, res, next) => {
	next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`listening on ${PORT}`);
});

//module.exports = app;
