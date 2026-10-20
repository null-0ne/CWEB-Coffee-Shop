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



/******************************** CONFIGURE HANDLEBARS *******************************/
// The custom helpers make it easier to format data in templates.
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: ".handlebars",
  layoutsDir: "./views/layouts",
  helpers: {
    eq: (a, b) => a === b, //simple equality helper function
    //helper function --> formats the date and time
    //say we uploaded the picture right now -> "2026-10-18T18:00:00"
    //output will be : 2026-10-18, 6:00 p.m.
    formatShortDate: (dateString) => 
      new Intl.DateTimeFormat("en-CA", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "America/Regina", //saskatchjewan time, for somereason without these im getting UTC so different time
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

//------------Story 4 - Showcase Gallery - Multer - Kevin Obillo -------------

//function which sends the user to the log in screen if they are not authorize user
//middleware
function authorizeCurrentUser(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
}


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
// story 1 for authentication has this -- authenticateTokenFromCookie function (story 1)
app.get("/showcase", authenticateTokenFromCookie, async (req, res) => {
  //for sorting/filter
  const { search, sort } = req.query;

  //need to get hte photos from the showcase table
  const photos = await AppDataSource.getRepository(Showcase).find(
    {
      relations: { user : true}, // this is going to load the uploader from user table
    }
  );

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
    if (sort === "title") {
      //sort in alphabetical order by the title
      return a.title.localeCompare(b.title);
    } else {
      //newest uploads first
      return new Date(b.uploadDate) - new Date(a.uploadDate);
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
    const photos = await AppDataSource.getRepository(Showcase).find(
      {
        relations: {user : true}, // added this aswell for the relations of my showcase
      }
    );
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
  //uploadDate will be automtically filled in bec of typeORM
  const photoInfo = {
    title: req.body.title,
    description: req.body.description,
    fileName: req.file.filename,
    userId: req.user.id // id of the logged in user, from Rylans token
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

//-------------------------END OF STORY 4 --------------------------------




/*********** Start the server *************/
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

