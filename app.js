const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser')
let bodyParser = require('body-parser');
let multer = require('multer');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
let upload = multer();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array()); // This should come after the bodyParser middleware

// middleware
app.use(express.static('public'));
app.use(express.json())

// view engine
app.set('view engine', 'ejs');

// environment variable for the connection string
const dbURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/fkr';

//connect to mongodb
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    console.log(`Connected to MongoDB on ${dbURI}`);
    //start the server
    app.listen(3000, () => console.log("Server is running on port 3000"))
    .on("error", (err) => {
        console.error(err);
        console.log("Server failed to start");
        process.exit(1);
    });
  })
  .catch((err) => {
    console.log(err);
    console.error("Failed to connect to MongoDB");
    process.exit(1);
  });

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

