require("dotenv").config();
const express = require("express"),
	cors = require('cors'),
	port = process.env.PORT || 4000,
	apiRoutes = require("./routes/apiRoutes"),
	authRoutes = require('./routes/authRoutes'),
	userRoutes = require('./routes/userRoutes'),
	mongoose = require("mongoose"),
	swaggerJsDoc = require('swagger-jsdoc'),
	swaggerUi = require('swagger-ui-express')
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
	})

const db = mongoose.connection;
db.once('open', () => {
	console.log("Connected to MongoDb database....")
})

// starting app
const app = express();

// middlewares
// app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.get("/", (req, res) => res.send("hello World!"));
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// server production assets
// if (process.env.NODE_ENV === "production") { // remember to change iot to development in the .env file
//     app.use(express.static(path.join("front_end/build")));
//     app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, 'front_end', 'build', 'index.html')));
// };

// starting the server
app.listen(port, () => console.log(`listening on port ${port}`));