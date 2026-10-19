const express = require("express");
const { randomUUID } = require("crypto");
const exphbs = require("express-handlebars");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { AppDataSource } = require("./data-source");
const { Showcase } = require("./entity/Showcase"); // showcase database
const { getSystemErrorMessage } = require("util");
const { error } = require("console");

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

/*********** HOME PAGE ************
 * URL: http://localhost:8000/
 * Home page: displays learning concepts and sample student names.
 ***********************************/
app.get("/", (req, res) => {
  res.render("home", {
    title: "INSERT YOUR APP NAME HERE",

    students: [
      //TODO Add you team names alphabetically by first name (include First letter of Family name)
      { name: "Garrett A.", section: "Contact & Hours" },
      { name: "Kevin O.", section: "Showcase Gallery - Multer" },
      { name: "Roseanne A.", section: "Custom Orders" },
      { name: "Rylan W.", section: "Auth & Profile" },
      { name: "Sam C.", section: "Menu Items" },
      { name: "Sucha S.", section: "Customer Reviews" },
    ],
  });
});

//Database Connection
AppDataSource.initialize()
  .then(() => {
    console.log("DB Connected ");
    const showcaseRepository = AppDataSource.getRepository(Showcase);
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
    if (sort === "size") {
      // smallest files first
      return a.size - b.size;
    } else if (sort === "date") {
      //newest uploads first
      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    } else {
      //default sort in alphabetical order by the title
      return a.title.localeCompare(b.title);
    }
  });

  res.render("showcase", {
    title: "Showcase Gallery",
    user: req.user, // same name Rylan uses
    photos: filteredPhotos,
    oldInput: req.query, // keeps the search box + sort dropdown filled in
  });
});


//TODO: Work on post
app.post(
  "/showcase",
  authenticateTokenFromCookie,
  authorizeCurrentUser,
  showcaseUpload.single("photo"),
async (req, res) => {
  //Multer adds req.file when a valid file is uploaded
  if(!req.file) {
    //if no file arrived, show to upload form again with an error message..
    error.push({msg: 'Please upload a valid image file.'})
  }
}


);



/*********** Start the server *************/
app.listen(PORT, () => {
  console.log(`Midterm Project running at http://localhost:${PORT}`);
});
