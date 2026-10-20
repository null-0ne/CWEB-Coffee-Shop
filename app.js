const express = require("express");
const { randomUUID } = require("crypto");
const exphbs = require("express-handlebars");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { AppDataSource } = require("./data-source");
const { Menu } = require("./entity/Menu"); // showcase database

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

//Database Connection
AppDataSource.initialize()
    .then(() => {
        console.log("DB Connected ");
    })
    .catch((err) => console.error(err));

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

/*********** TOKEN VALIDATION ************

 ***********************************/
//ADD!!

//DISPLAY MENU
app.get("/menu", async (req, res) => {
    const menuRepository = await AppDataSource.getRepository(Menu);
    const menuItems = await menuRepository.find();
    console.log(menuItems);

    const { search, sort } = req.query;
    console.log(search);
    console.log(sort);
    let filteredMenuItems = menuItems;

    // If the user typed a search term, filter the image list before rendering it.
    if (search && search.trim().length) {
        const searchLower = search.toLowerCase();

        //filter based on the given filter type [sort]

        if (sort === "type") {
            filteredMenuItems = menuItems.filter((item) =>
                item.type.includes(searchLower),
            );
        } else if (sort === "title") {
            filteredMenuItems = menuItems.filter((item) =>
                item.name.toLowerCase().includes(searchLower),
            );
        }
    }

    res.render("menu", {
        menuItems: filteredMenuItems || menuItems,
        oldInput: req.query, // Pass the old input values for the search and sort fields.
        success: "",
        error: "",
    });
});

//ADD NEW MENU ITEM
app.post(
    "/menu",
    [
        //middleware - express-validator uses to create the "rules"
        body("itemName").isLength({ min: 2 }).isString(),
        body("itemType").isLength({ min: 2 }).isString(),
    ],
    async (req, res) => {
        const validationError = validationResult(req);
        console.log(validationError);

        const menuRepository = await AppDataSource.getRepository(Menu);

        const { itemName, itemType } = req.body; //the two form values

        if (validationError.errors.length != 0) {
            return res.render("menu", {
                success: false,
                error: "Invalid menu item",
            });
        }

        const newMenuItem = {
            itemName: itemName,
            type: itemType,
        };

        // Save this item to the database
        await menuRepository.save(newMenuItem);

        // Render the same form again, but now indicate success with the uploaded filename.
        res.render("menu", {
            success: true,
            error: null,
        });
    },
);

/*********** Start the server *************/
app.listen(PORT, () => {
    console.log(`Exercise-LO2 running at http://localhost:${PORT}`);
});
