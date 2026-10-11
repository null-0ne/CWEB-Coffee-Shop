const express = require('express');
const {randomUUID} = require('crypto')
const exphbs = require('express-handlebars');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { AppDataSource } = require('./data-source');
const { Showcase } = require('./entity/Showcase'); // showcase database

// Create the Express app and configure key app-level settings.
const app = express();
const PORT = 8000;
const SECRET_KEY = 'mysecret'; //came from Rylan Story, need for JWT


//Authentication middleware
//
// function setRequestUserIfTokenCookieExists(req, res, next) {
//     const token = req.cookies.token;

//     if (!token) {
//         return next();
//     }

//     // If the browser sent a token, validate it before using the user's data.
//     jwt.verify(token, SECRET_KEY, (err, user) => {
//         if (err) {
//             // Invalid/expired token: clear it and continue without sending a redirect,
//             // otherwise the request would try to respond twice.
//             res.clearCookie('token');
//             req.user = null;
//             return next();
//         }

//         // Store the authenticated user on the request so other routes can access it.
//         req.user = user;
//         return next();
//     });
// }

//function which sends the user to the log in screen if they are not authorize user
//middleware
function authorizeCurrentUser(req,res,next) {
  if(!req.user)
  {
    return res.redirect('/login');
  }
  next();
}




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
//Load the authenticated user from the JWT cookie for every request
//app.use(setRequestUserIfTokenCookieExists);


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


//Database Connection
AppDataSource.initialize().then(() => {
    console.log("DB Connected ");
    const showcaseRepository = AppDataSource.getRepository(Showcase);
}).catch(err => console.error(err));


//Story 4 - Showcase Gallery - Multer - Kevin Obillo


//store uploaded files on disk
const storage = multer.diskStorage({
  destination: 'public/images/',
  filename:(req, file, callBack) => callBack(null, Date.now() + '-' + file.originalname.toLowerCase())
});

//File upload handler:
const showcaseUpload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024},
  fileFilter: (req, file, callBack) => {
    if(file.mimetype.startsWith('image/'))
    {
      callBack(null, true);
    } else{
      callBack(new Error('Only image file are allowed'));
    }
  }
});

//render showcase page
//show all showcase photos from the database, with the optional search and sorting.
//show case photos can be viewed by authorize/logged in users only
// story 1 for authentication has this -- authenticateTokenFromCookie function
app.get("/showcase", authenticateTokenFromCookie, async (req, res) => {

  //for sorting/filter
  const {search, sort} = req.query;

  //need to get hte photos from the showcase table
  const photos = await AppDataSource.getRepository(Showcase).find();

  let filteredPhotos = photos;

  res.render("showcase", {
    title: "Upload Image",
    success: false,
    uploadFile:null,
    error: null,
  })
});

function handleShowCaseUpload(req, res, next) {
  showcaseUpload.single("photo")(req,res)
}




/*********** Start the server *************/
app.listen(PORT, () => {
  console.log(`Midterm Project running at http://localhost:${PORT}`);
});
