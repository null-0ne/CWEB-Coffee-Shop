const express = require("express");
const { randomUUID } = require("crypto");
const exphbs = require("express-handlebars");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

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

/*********** HOME PAGE ************
 * URL: http://localhost:8000/
 * Home page: displays learning concepts and sample student names.
 ***********************************/
app.get("/", (req, res) => {
    res.render("home", {
        title: "INSERT YOUR APP NAME HERE",

        students: [
            //TODO Add you team names alphabetically by first name (include First letter of Family name)
            { name: "Garrett T.", section: "Page 6 - Contact & Hours" },
            { name: "Kevin O.", section: "Page 4 - Showcase Gallery - Multer" },
            { name: "Roseanne A.", section: "Page 3 - Custom Orders" },
            { name: "Rylan W.", section: "Page 1 - Auth & Profile" },
            { name: "Samuel C.", section: "Page 2 - Menu Items" },
            { name: "Sucha S.", section: "Page 5 - Customer Reviews" },
        ],
    });
});

app.get("/menu", (req, res) => {
    res.render("menu", {});
});

/*********** Start the server *************/
app.listen(PORT, () => {
    console.log(`Exercise-LO2 running at http://localhost:${PORT}`);
});
