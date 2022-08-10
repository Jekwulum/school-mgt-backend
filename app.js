require("dotenv").config();

const express = require("express"),
	cors = require('cors'),
	mongoose = require("mongoose"),
	createError = require('http-errors'),
	morgan = require("morgan"),
	path = require('path');

const apiRoutes = require("./routes/apiRoutes"),
	authRoutes = require('./routes/authRoutes');


global.appRoot = path.resolve(__dirname);
global.appName = `School Management API`;

const port = process.env.PORT || 4000,
	logger = require('./middlewares/utils/logger'),
	sqlDb = require('./models/index'),
	swaggerJsDoc = require('swagger-jsdoc'),
	swaggerUi = require('swagger-ui-express'),
	swaggerDocument = require("./middlewares/swagger.json");

const swaggerOptions = {
	swaggerDefinition: {
		info: {
			title: 'mySchool API',
			description: 'API for a school management application',
			contact: {
				name: "Charles Nwoye",
				email: "charlesnwoye2@gmail.com",
				url: "https://jekwulum.vercel.app"
			},
			servers: ['http://localhost:40000']
		}
	},
	apis: ['app.js', './routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);


// connecting to db
mongoose.connect(process.env.MONGO_ATLAS_URL, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => logger.info(`[Database connection]: Connected correctly to MongoDB server for ${appName}..`))
	.catch(error => logger.error(`Connection error to MongoDB Server. [Issue]: ${error}`));;

const db = mongoose.connection;
db.once('open', () => {
	console.log(`[Database connection]: Connected correctly to MongoDB server for ${appName}..`)
});


(async () => {
	await sqlDb.sequelize.sync({ alter: true });
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
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// routes
app.get("/", (req, res) => res.send("hello World!"));
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use((req, res, next) => {
	next(createError(404, 'This URL does not exist!'));
});


// starting the server
app.listen(port, () => console.log(`[${appName}]: http://localhost:${port}`));