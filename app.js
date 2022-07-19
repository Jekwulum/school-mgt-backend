require("dotenv").config();

const express = require("express"),
	cors = require('cors'),
	mongoose = require("mongoose");
const createError = require('http-errors');

const apiRoutes = require("./routes/apiRoutes"),
	authRoutes = require('./routes/authRoutes');

const port = process.env.PORT || 4000,
	sqlDb = require('./middlewares/config/sql_database'),
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
				url: "https://jekwulum-portfolio.netlify.app"
			},
			servers: ['http://localhost:40000']
		}
	},
	apis: ['app.js', './routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);


// connecting to db
mongoose.connect("mongodb://localhost:27017/test", { useUnifiedTopology: true, useNewUrlParser: true },
	function (err) {
		if (err) throw err;
	});

const db = mongoose.connection;
db.once('open', () => {
	console.log("Connected to MongoDb database....")
});


// SQL
try {
	sqlDb.authenticate()
		.then(() => console.log('Connection to SQL database has been established successfully.'))
		.catch(err => console.error(`SQL db connection error ${err}`));
} catch (error) {
	console.error(`Unable to connect to the database: ${error}`);
};
(async () => {
	await sqlDb.sync({ alter: true });
})();


// starting app
const app = express();

// middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Accept", "application/json");
	res.header("Access-Control-Allow-Credentials", 'true');
	next();
});


// routes
app.get("/", (req, res) => res.send("hello World!"));
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use((req, res, next) => {
	next(createError(404, 'This URL does not exist!'));
});


// starting the server
app.listen(port, () => console.log(`listening on port ${port}`));