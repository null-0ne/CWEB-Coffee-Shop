const express = require("express");
const exphbs = require("express-handlebars");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { AppDataSource } = require("./data-source")

const reviews = require('./fixtures/data-seed')
const {Review} = require('./entity/Review');
const reviewRepository = AppDataSource.getRepository(Review);

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

// Middleware to authenticate JWT from cookie
function authenticateTokenFromCookie(req, res, next) {
  const token = req.cookies.token;
  // If the token doesn't exist ( user is not logged in )
  // do nothing and move on from middleware
  if (!token){
    //res.status(401).json({ error: 'Missing token' });
    return next();
  } //return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    // req.user.id would give the id because the token is linked to a specific user so once the JWT is verified it returns the "decoded" payload
    next();
  });
}

// Connect DB
AppDataSource.initialize().
then(() => {
    console.log("DB Connected ");
    reviews();
})
.catch(err => console.error(err));



/*********** HOME PAGE ************
 * URL: http://localhost:8000/
 * Home page: displays learning concepts and sample student names.
 ***********************************/
app.get("/", (req, res) => {
  res.render("home", {
    title: "Coffee Shop Order Hub",

    students: [
      //TODO Add you team names alphabetically by first name (include First letter of Family name)
      { name: "Garret T.", section: "Page 6 - Contact & Hours" },
      { name: "Kevin O.", section: "Page 4 - Showcase Gallery - Multer" },
      { name: "Roseman A.", section: "Page 3 - Custom Orders" },
      { name: "Rylan W.", section: "Page 1 - Auth & Profile" },
      { name: "Samuel C.", section: "Page 2 - Menu Items" },
      { name: "Sucha S.", section: "Page 5 - Customer Reviews" },
    ],
  });
});

//#region Sucha Story here

app.get("/reviews",authenticateTokenFromCookie, async (req, res) => {
    
    if(!req.user.id)
    {
      return res.redirect("http://localhost:8000/");
    }
    try {
      const reviewsData = await reviewRepository.find({
        order: {
          reviewDate: "DESC"
        }
      });
      
      res.render("reviews", {
        title: "Reviews and Ratings",
        reviews: reviewsData
      });
      

  } catch (err) {
    console.error(err);
    res.send("Error fetching data");
  }
});

app.post(
  "/reviews",authenticateTokenFromCookie,
  [
    body("rating").notEmpty().withMessage("Give Rating"),
    body("review").notEmpty().withMessage("You must enter review"),
    body("date").notEmpty().withMessage("You must enter the Visited Date")
  ],
  async (req, res) => {
    if(!req.user)
    {
      return res.redirect("http://localhost:8000/");
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Re-render form with errors and old input
      return res.render("reviews", {
        errors: errors.array(),
        oldInput: req.body
      });
    }

    try {
      const check = await reviewRepository.findOne({ where: { userId: req.user.id } });
      if(check){
        await reviewRepository.update(
          { userId: req.user.id }, // WHERE clause
          {
            rating: req.body.rating,
            review: req.body.review,
            visitDate: req.body.date,
          }
      )}
      else {
        const newReview = await reviewRepository.create({
          userId: req.user.id,
          rating: req.body.rating,
          review: req.body.review,
          visitDate: req.body.date
        });
        await reviewRepository.save(newReview);
      }

      
      const reviewsData =  await reviewRepository.find({
        order: {
          reviewDate: "DESC"
        }
      });

      return res.render("reviews", { 
        reviews: reviewsData
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create Review: ' + error});
    }
  },
);

//#endregion



/*********** Start the server *************/
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

