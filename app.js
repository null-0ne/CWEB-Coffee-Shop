const express = require("express");
const { randomUUID } = require("crypto");
const exphbs = require("express-handlebars");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const sequelize = require("./database");
const reviewRepository = require("./review-repository");

// Create the Express app and configure key app-level settings.
const app = express();
const PORT = 8000;

function authorizeCurrentUser(req, res, next) {
  // TODO: if req.user does not exist redirect to login
  if (!req.user) {
    res.redirect("http://localhost:8000/login");
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

app.get("/reviews", async (req, res) => {
  if(!req.cookies.id)
  {
    return res.redirect("http://localhost:8000/");
  }
  const reviews =  await reviewRepository.findAllReviews();
  const plainReviews = reviews.map(r => r.get({ plain: true }));

  res.render("reviews", {
    title: "Reviews and Ratings",
    reviews: plainReviews
  });
});

app.post(
  "/reviews",
  [
    body("rating").notEmpty().withMessage("Give Rating"),
    body("review").notEmpty().withMessage("You must enter review"),
  ],
  async (req, res) => {
    if(!req.cookies.id)
    {
      return res.redirect("http://localhost:8000/");
    }
    const errors = validationResult(req);
    //console.log(errors);
    if (!errors.isEmpty()) {
      // Re-render form with errors and old input
      return res.render("reviews", {
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    try {
      const newReview = await reviewRepository.createReview({
        id: req.cookies.id,
        rating: req.body.rating,
        review: req.body.review,
        name: req.body.name
      });
      
      const reviews =  await reviewRepository.findAllReviews();
      const plainReviews = reviews.map(r => r.get({ plain: true }));
      return res.render("reviews", { 
        reviews: plainReviews
      });
      //res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create Review: ' + error});
    }
  },
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    // Sync the model to the SQLite database.
    // force: true drops and recreates the table, which is useful for demo work.
    await sequelize.sync({ force: false });
    console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`Exercise-LO2 running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Application startup failed:', error);
    process.exit(1);
  }
})();

/*********** Start the server *************/

