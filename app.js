require("dotenv").config();

const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const createError = require('http-errors');
const morgan = require("morgan");
const path = require('path');
const YAML = require('yamljs');

const apiRoutes = require("./routes/apiRoutes");
const authRoutes = require('./routes/authRoutes');


global.appRoot = path.resolve(__dirname);
global.appName = `School Management API`;

const port = process.env.PORT || 4000;
const logger = require('./middlewares/utils/logger');
const { db: sqlDb } = require('./models/index');
const swaggerJsDocs = YAML.load('./middlewares/utils/api.yaml');
const swaggerUi = require('swagger-ui-express');


// connecting to db

// mongodb
mongoose.connect(process.env.MONGO_ATLAS_URL, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => logger.info(`[Database connection]: Connected correctly to MongoDB server for ${appName}..`))
	.catch(error => logger.error(`Connection error to MongoDB Server. [Issue]: ${error}`));;

const db = mongoose.connection;
db.once('open', () => {
	console.log(`[Database connection]: Connected correctly to MongoDB server for ${appName}..`)
});

// sql db
(async () => {
	await sqlDb.sequelize.authenticate()
		.then(() => {
			console.log(`[Database connection]: Connected correctly to PostgresDB server for ${appName}..`);
			logger.info(`[Database connection]: Connected correctly to PostgresDB server for ${appName}..`);
		})
		.catch(err => {
			console.error(`Unable to connect to PostgresDB Server. [Issue]: ${err}`);
			logger.error(`Unable to connect to PostgresDB Server. [Issue]: ${err}`)
		});
})();


// starting app
const app = express();

// middlewares
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Accept", "application/json");
	res.header("Access-Control-Allow-Credentials", 'true');
	next();
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));


// routes
app.get("/", (req, res) => res.redirect("/api-docs"));
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use((req, res, next) => {
	next(createError(404, 'This URL does not exist! visit https://j-myschool-api.herokuapp.com/api-docs'));
});


// starting the server
app.listen(port, () => console.log(`[${appName}]: http://localhost:${port}`));