const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('cookie-session');
const compression = require('compression');
dotenv.config({ path: './config/config.env' });
require('./config/dbConnection')(); // db connection
const PORT = 3001;

const { errorHandler, AppError } = require('@utils/tdb_globalutils');

const appointmentsRoute = require('./constants/consts').routeConsts.appointmentRoute;
const appointmentsRouter = require('./routes/appointmentRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());

app.use(
  session({
    signed: false,
  }),
);

app.use(compression());

app.use(appointmentsRoute, appointmentsRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
