const express = require("express");
const exphbs = require("express-handlebars");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { AppDataSource } = require("./data-source")



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

