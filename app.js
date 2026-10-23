const express = require("express");
const exphbs = require("express-handlebars");
const { body, validationResult } = require("express-validator");
const cookieParser = require("cookie-parser");
const { AppDataSource } = require("./data-source");
const { Submission } = require("./entity/Submission");
const { StoreInformation } = require("./entity/StoreInformation");

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

// Datasource
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => console.log(err));

/*********** HOME PAGE ************
 * URL: http://localhost:8000/
 * Home page: displays learning concepts and sample student names.
 ***********************************/
app.get("/", (req, res) => {
  res.render("home", {
    title: "INSERT YOUR APP NAME HERE",

    students: [
      { name: "Garrett T.", section: "Contact & Hours" },
      { name: "Kevin O.", section: "Showcase Gallery - Multer" },
      { name: "Roseanne A.", section: "Custom Orders" },
      { name: "Rylan W.", section: "Auth & Profile" },
      { name: "Samuel C.", section: "Menu Items" },
      { name: "Sucha S.", section: "Customer Reviews" },
    ],
  });
});

// Contact page: display the form and store information
app.get("/contact", async (req, res) => {
  try {
    const storeInformationRepo = AppDataSource.getRepository(StoreInformation);

    const storeInformation = await storeInformationRepo.find({
      order: {
        displayOrder: "ASC", // Displaying information in ascending order
      },
    });

    // Group each db record so each section is displayed
    const contactDetails = storeInformation.filter(
      (item) => item.category === "contact",
    );
    const locationDetails = storeInformation.filter(
      (item) => item.category === "location",
    );
    const hours = storeInformation.filter((item) => item.category === "hours");

    return res.render("contact", {
      title: "Contact Us",
      input: {},
      contactDetails,
      locationDetails,
      hours,
    });
  } catch (err) {
    console.error("Error fetching store information:", err);

    // Database/server error
    return res.status(500).render("contact", {
      title: "Contact Us",
      input: {},
      error: "We couldn't load the store information right now.",
      contactDetails: [],
      locationDetails: [],
      hours: [],
    });
  }
});

// Contact form: validate and save the submission.
app.post(
  "/contact",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Please enter your name.")
      .isLength({ max: 255 })
      .withMessage("Name must be 255 characters or fewer."),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Please enter your email.")
      .bail()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .isLength({ max: 255 })
      .withMessage("Email must be 255 characters or fewer."),

    body("subject")
      .trim()
      .notEmpty()
      .withMessage("Please enter a subject.")
      .isLength({ max: 255 })
      .withMessage("Subject must be 255 characters or fewer."),

    body("message")
      .trim()
      .notEmpty()
      .withMessage("Please enter a message.")
      .isLength({ min: 10, max: 5000 })
      .withMessage("Message must be between 10 and 5000 characters."),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Invalid form input error
      return res.status(400).render("contact", {
        title: "Contact Us",
        errors: errors.array(),
        input: req.body,
      });
    }

    try {
      const submissionRepo = AppDataSource.getRepository(Submission);

      const submission = submissionRepo.create({
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        subject: req.body.subject.trim(),
        message: req.body.message.trim(),
      });

      await submissionRepo.save(submission);

      return res.render("contact", {
        title: "Contact Us",
        input: {},
        success: "Thank you! Your inquiry has been submitted.",
      });
    } catch (err) {
      console.error("Error saving contact inquiry:", err);

      // Server/database error
      return res.status(500).render("contact", {
        title: "Contact Us",
        input: req.body,
        error: "We couldn't submit your inquiry right now. Please try again.",
      });
    }
  },
);

/*********** Start the server *************/
app.listen(PORT, () => {
  console.log(`Exercise-LO2 running at http://localhost:${PORT}`);
});
