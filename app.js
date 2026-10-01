const express = require('express');
const {randomUUID} = require('crypto')
const exphbs = require('express-handlebars');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { AppDataSource } = require('./data-source');

// Create the Express app and configure key app-level settings.
const app = express();
const PORT = 8000;


/******************************** CONFIGURE HANDLEBARS *******************************/
// The custom helpers make it easier to format data in templates.
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    layoutsDir: './views/layouts',
    helpers: {
        eq: (a, b) => a === b, //simple equality helper function
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');


/********************* USE SOME MIDDLEWARE on EACH REQUEST  ************************/
app.use(express.static('./public')); // make files and folder in the public folder available to the web
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//Database Connection
AppDataSource.initialize().then(() => {
    console.log("DB Connected ");
}).catch(err => console.error(err));

/*********** HOME PAGE ************
 * URL: http://localhost:8000/
 * Home page: displays learning concepts and sample student names.
***********************************/
app.get('/', (req, res) => {
  res.render('home', {
    title: 'INSERT YOUR APP NAME HERE',
	
    students:[ //TODO Add you team names alphabetically by first name (include First letter of Family name)
		{ name: 'Garrett A.', section: 'Contact & Hours'},
		{ name: 'Kevin O.', section: 'Showcase Gallery - Multer'},
		{ name: 'Roseanne A.', section: 'Custom Orders'},
		{ name: 'Rylan W.', section: 'Auth & Profile'},
		{ name: 'Sam C.', section: 'Menu Items'},
		{ name: 'Sucha S.', section: 'Customer Reviews'}
    ]
  });
});


//Story 4 - Showcase Gallery - Multer - Kevin Obillo
const storage = multer.diskStorage({
  destination: 'public/images/',
  fileName:(req, file, callBack) => (null, Date.now() + '-' + file.originalname.toLowerCase())
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024},
  fileFilter: (req, file, callBack) => {
    if(file.mimetype.startsWith('image/'))
    {
      callBack(null, true);
    } else{
      callBack(new Error('Only image file only'));
    }
  }
});

app.get("/upload", (req, res) => {
  res.render("upload", {
    title: "Upload Image",
    success: false,
    uploadFile:null,
    error: null,
  })
})


/*********** Start the server *************/
app.listen(PORT, () => {
  console.log(`Exercise-LO2 running at http://localhost:${PORT}`);
});
