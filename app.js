const express = require("express");
const { randomUUID } = require("crypto");
const exphbs = require("express-handlebars");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { AppDataSource } = require("./data-source");
const { Showcase } = require("./entity/Showcase"); // showcase database

// Create the Express app and configure key app-level settings.
const app = express();
const PORT = 8000;
const SECRET_KEY = "mysecret"; //came from Rylan Story, need for JWT

//Temporary, just copied this from page 1 so i can test my own page.
// Middleware to authenticate JWT from cookie
function authenticateTokenFromCookie(req, res, next) {
  const token = req.cookies.token;
  // If the token doesn't exist ( user is not logged in )
  // do nothing and move on from middleware
  if (!token) {
    //res.status(401).json({ error: 'Missing token' });
    return next();
  } //return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    // req.user.id would give the id because the token is linked to a specific user so once the JWT is verified it returns the "decoded" payload
    next();
  });
}

//function which sends the user to the log in screen if they are not authorize user
//middleware
function authorizeCurrentUser(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
}

/******************************** CONFIGURE HANDLEBARS *******************************/
// The custom helpers make it easier to format data in templates.
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: ".handlebars",
  layoutsDir: "./views/layouts",
  helpers: {
    eq: (a, b) => a === b, //simple equality helper function
    //helper function for the photos that'll convert the number of bytes in megabytes to 1 decimal place
    //for example: if the photo is 2,097,123 or 1,543,210
    //the output will be : 2 MB --- 1.5 MB
    formatSizeMb: (bytes) => {
      const mb = Number(bytes) / (1024 * 1024);
      return `${mb.toFixed(1)} MB`
    },
    //helper function --> formats the date and time
    //say we uploaded the picture right now -> "2026-10-18T18:00:00"
    //output will be : 2026-10-18, 6:00 p.m.
    formatShortDate: (dateString) => 
      new Intl.DateTimeFormat("en-CA", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(dateString)),
  },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

/********************* USE SOME MIDDLEWARE on EACH REQUEST  ************************/
app.use(express.static("./public")); // make files and folder in the public folder available to the web
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//Load the authenticated user from the JWT cookie for every request
//app.use(setRequestUserIfTokenCookieExists);

// Connect DB
AppDataSource.initialize().then(() => {
    console.log("DB Connected ");
}).catch(err => console.error(err));



/*********** HOME PAGE ************
 * URL: http://localhost:8000/
 * Home page: displays learning concepts and sample student names.
 ***********************************/
app.get("/", (req, res) => {
  res.render("home", {
    title: "Coffee Shop Order Hub",

    students: [
      //TODO Add you team names alphabetically by first name (include First letter of Family name)
      { name: "Garret A.", section: "Page 6 - Contact & Hours" },
      { name: "Kevin O.", section: "Page 4 - Showcase Gallery - Multer" },
      { name: "Roseman A.", section: "Page 3 - Custom Orders" },
      { name: "Rylan W.", section: "Page 1 - Auth & Profile" },
      { name: "Samuel C.", section: "Page 2 - Menu Items" },
      { name: "Sucha S.", section: "Page 5 - Customer Reviews" },
    ],
  });
});

//Database Connection
AppDataSource.initialize()
  .then(() => {
    console.log("DB Connected ");
  })
  .catch((err) => console.error(err));

//Story 4 - Showcase Gallery - Multer - Kevin Obillo

//store uploaded files on disk
const storage = multer.diskStorage({
  destination: "public/images/",
  filename: (req, file, callBack) =>
    callBack(null, Date.now() + "-" + file.originalname.toLowerCase()),
});

//File upload handler:
const showcaseUpload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callBack) => {
    if (file.mimetype.startsWith("image/")) {
      callBack(null, true);
    } else {
      //reject the image if invalid, on the post -> it'll just show "Please upload a valid image file"
      callBack(null, false);
    }
  },
});

//render showcase page
//show all showcase photos from the database, with the optional search and sorting.
//show case photos can be viewed by authorize/logged in users only
// story 1 for authentication has this -- authenticateTokenFromCookie function (story 1)
app.get("/showcase", authenticateTokenFromCookie, async (req, res) => {
  //for sorting/filter
  const { search, sort } = req.query;

  //need to get hte photos from the showcase table
  const photos = await AppDataSource.getRepository(Showcase).find();

  let filteredPhotos = photos;

  //if the user typed something in search, only keep photos that match
  if (search && search.trim().length) {
    const searchLower = search.toLowerCase();
    filteredPhotos = photos.filter(
      (photo) =>
        // if i want to search using the title or description?
        photo.title.toLowerCase().includes(searchLower) ||
        (photo.description && photo.description.toLowerCase().includes(searchLower)), //check if the description exist first before searching it
    );
  }

  //sort the photos based on what the user picked
  filteredPhotos.sort((a, b) => {
    if (sort === "date") {
      //newest uploads first
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else {
      //default sort in alphabetical order by the title
      return a.title.localeCompare(b.title);
    }
  });

  res.render("showcase", {
    hasPhotos: photos.length > 0 , // same logic we used for example lo2. using this below the upload button
    title: "Showcase Gallery",
    user: req.user, // same name Rylan uses
    photos: filteredPhotos,
    oldInput: req.query, // keeps the search box + sort dropdown filled in
  });
});


//TODO: Work on post
/**
 * Only logged in users can upload pictures.
 * authenticateTokenFromCookie -> this will set the req.user
 * authorizeCurrentUser -> will send the user to /login if user is not authorized to upload
 * showcaseUpload.single("photo") -> for multr to read the form
 * 
 */
app.post(
  "/showcase",
  authenticateTokenFromCookie,
  authorizeCurrentUser,
  showcaseUpload.single("photo"),
  [//i want to add a validator for the title and description as well
    //when a user is uploading a picture, they can manually put the title
    //of what are they trying to upload + the description(optional only).
    //https://express-validator.github.io/docs/api/validation-chain/#notempty   
    //validator chains
    //notEmpty -> checks if the title is NOT EMPTY
    //withMessage -> will set the error message if .notEmpty fails
    //.custom 
    body('title').notEmpty().withMessage('Title is required').custom((val) => {
      if(val.length > 50) {
        throw new Error ("Title must be only 50 characters or less")
      }
      return true;
    }),
    //since i want the description to be 'only optional'
    //i dont need a validator here but i want to limit 
    //the user's description?
    //https://express-validator.github.io/docs/api/validation-chain/#optional
    body('description').optional().custom ((val) => {
      if(val.length > 250 ){
        throw new Error ("Description must only 250 characters or less")
      }
      return true;
    })
  ],
async (req, res) => {

  //for validation express i need to collect the error checks 
  //https://express-validator.github.io/docs/6.0.0/validation-result-api/
  const errors = validationResult(req).array();

  //Multer adds req.file when a valid file is uploaded
  if(!req.file) {
    //if no file arrived, show to upload form again with an error message..
    errors.push({msg: 'Please upload a valid image file.'}); // putting this error inside our errors arrays if file is not valid
  } 

  if(errors.length > 0){
    //if something is wrong, itll just show the page again with the errors
    const photos = await AppDataSource.getRepository(Showcase).find();
    //so the photos that'll be shown is when it was uploaded - newest photos first
    photos.sort((a,b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    //render the showcase handlebar again
    return res.render("showcase", {
      hasPhotos: photos.length > 0,
      title: "Showcase Gallery",
      user: req.user,
      photos: photos,
      errors: errors,
      oldInput: req.body, // this part will just keep what the user typed in the title and description
    });
  }

  //i need to build the photo info base on my database, must match the showcase entity columns or it'll crash
  //id and uploadedAt will be automtically filled in bec of typeORM
  const photoInfo = {
    title: req.body.title,
    description: req.body.description,
    fileName: req.file.filename,
    userId: req.user.id // i got this from rylan story which he uses "userName" so i can get the user who uploaded the pic
  }

  //now if no errors and it was a successful upload
  //need to save the info to the data base
  await AppDataSource.getRepository(Showcase).save(photoInfo);
  //debugger -- delete later
  console.log('New showcase photo: ', photoInfo)

  //this will just redirect or refresh the page so the new photo shows up
  res.redirect("/showcase")
    
}


);

//for testing - need an acount to be able to access my /showcase page -- DELETE LATER
app.get("/test-login", (req, res) => {
  // fake user, same shape as Rylan's token { id, userName }
  const token = jwt.sign({ id: 1, userName: "Kevin" }, SECRET_KEY, { expiresIn: "7d" });

  // save the token in an HttpOnly cookie, same as Rylan's login
  res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.redirect("/showcase");
});

//#region Sucha Story here

app.get("/reviews", async (req, res) => {
    if(!req.cookies.id)
    {
      return res.redirect("http://localhost:8000/");
    }
    try {
      const reviewRepository = AppDataSource.getRepository(Review);
      const reviews = reviewRepository.find();
      

      res.render("reviews", {
        title: "Reviews and Ratings",
        reviews: reviews
      });

  } catch (err) {
    console.error(err);
    res.send("Error fetching data");
  }
});

//#endregion



/*********** Start the server *************/
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

