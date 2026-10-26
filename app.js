const express = require("express");
const { randomUUID } = require("crypto");
const exphbs = require("express-handlebars");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { AppDataSource } = require("./data-source");
const { Submission } = require("./entity/Submission");
const { StoreInformation } = require("./entity/StoreInformation");
const { User } = require("./entity/User");
const { Showcase } = require("./entity/Showcase");
const { Review } = require("./entity/Review");
const { Menu } = require("./entity/Menu");
const { Order } = require("./entity/Order");
const { OrderItem } = require("./entity/OrderItem");
const {
    users,
    showcasePhotos,
    reviews,
    storeInformation,
    menu,
} = require("./fixtures/data-seed");

// Create the Express app and configure key app-level settings.
const app = express();
const PORT = 8000;
const SECRET_KEY = "mysecret";

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

function authorizeCurrentUser(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }

  next();
}

// Connect DB
AppDataSource.initialize()
  .then(() => {
    console.log("DB Connected");
  })
  .then(async () => {
    const userRepository = AppDataSource.getRepository(User); // get user repository
    if ((await userRepository.count()) === 0) {
      const userEntities = userRepository.create(users); // Create objects based on User entity
      await userRepository.save(userEntities); // Save fake data to the database
      console.log("Users seeded")
    }
  })
  .then(async () => {
    const userRepository = AppDataSource.getRepository(User); // get user repository
    //story 4 -- for my seed i just used the userName to find the person who uploaded it
    //so i need the userRepo to  lookup the actual user so I can get their userId.
    //IMPORTANT: becuase on my table, userId is connected to the users table as foreign key.
    const showcaseRepository = AppDataSource.getRepository(Showcase); // get showcase repository
    //Only add the seed data if the showcase table is empty, so we dont add the same fake datas again.
    //Note, if we run the SQL - it'll truncate the table and this will feed the fake data again
    if ((await showcaseRepository.count()) === 0) {
      const photosWithUserId = []; //The empty array which will store the photos with their real userId
      for (const photo of showcasePhotos) {
        //this way i can find the real user by userName so userId can matches the foreign key
        const uploader = await userRepository.findOneBy({
          userName: photo.userName,
        });
        if (uploader) {
          photosWithUserId.push({ ...photo, userId: uploader.id }); //copying the photo data and adding the uploaders actual id
        }
      }
      const showcaseEntities = showcaseRepository.create(photosWithUserId); //turning the photo datas into Showcase object
      await showcaseRepository.save(showcaseEntities); // save fake data to database
      console.log("Showcase seeded")
    }
  })
  .then(async () => {
    const reviewRepository = AppDataSource.getRepository(Review);
    // Seed reviews only when the table is empty.
    if ((await reviewRepository.count()) === 0) {
      const reviewEntities = reviewRepository.create(reviews);
      await reviewRepository.save(reviewEntities);
      console.log("Reviews seeded")
    }
  })
  .then(async () => {
    const storeInformationRepository =
      AppDataSource.getRepository(StoreInformation);

    // Seed store information only when the table is empty.
    if ((await storeInformationRepository.count()) === 0) {
      const storeInformationEntities =
        storeInformationRepository.create(storeInformation);

      await storeInformationRepository.save(storeInformationEntities);
      console.log("Store information seeded.");
    }
  })
   .then(async () => {
        //create menu repository
        const menuRepository = AppDataSource.getRepository(Menu);
        if(await menuRepository.count() === 0){ //if table is empty, seed the data in
        const MenuEntries = menuRepository.create(menu);

        //seed menu entries into menu table
        await menuRepository.save(MenuEntries);
        console.log("Menu information seeded");
        }
    })
  .catch((err) => console.error(err));

/*********** HOME PAGE ************
 * URL: http://localhost:8000/
 * Home page: displays learning concepts and sample student names.
 ***********************************/
app.get("/", authenticateTokenFromCookie, (req, res) => {
  res.render("home", {
    title: "Coffee Shop Hub",
    user: req.user, // If there is no token this will be undefined and
    // result in a false in main.handlebars

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
app.get("/contact", authenticateTokenFromCookie, async (req, res) => {
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
      user: req.user,
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
      user: req.user,
      input: {},
      error: "We couldn't load the store information right now.",
      contactDetails: [],
      locationDetails: [],
      hours: [],
    });
  }
});

/**
 * LOGIN GET request
 */
app.get("/login", authenticateTokenFromCookie, (req, res) => {
  res.render("account-auth", {
    title: "Login",
    user: req.user,
    isRegister: false,
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/"); // Not sure how to redirect back to the page you were on, but that might not be proper functionality anyway
});

app.post("/login", async (req, res) => {
  const { id, userName, email, password } = req.body;
  // create repository
  const userRepository = AppDataSource.getRepository(User);
  // query the database to find a user based on the inputted email
  const user = await userRepository.findOneBy({ email: email });
  // check if that user exists and if the password matches
  if (user && password === user.password) {
    // If password matches, log in and redirect
    // create JWT
    const token = jwt.sign(
      { id: user.id, userName: user.userName },
      SECRET_KEY,
      { expiresIn: "1h" },
    );
    // Set token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true if using HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.redirect("/");
  } else {
    return res.render("account-auth", {
      title: "Login",
      user: req.user,
      isRegister: false,
      errors: [{ msg: "Email or password is incorrect" }],
      oldInput: req.body,
    });
  }
});

//------------Story 6 - Contact & Hours - Garrett Thomson -------------

// Helper function to retrieve the store information for the Contact page.
async function getContactStoreInformation() {
  const storeInformationRepo = AppDataSource.getRepository(StoreInformation);

  const storeInformation = await storeInformationRepo.find({
    order: {
      displayOrder: "ASC", // Displaying information in ascending order
    },
  });

  // Group each db record so each section is displayed
  return {
    contactDetails: storeInformation.filter(
      (item) => item.category === "contact",
    ),
    locationDetails: storeInformation.filter(
      (item) => item.category === "location",
    ),
    hours: storeInformation.filter((item) => item.category === "hours"),
  };
}

app.post(
  "/contact",
  authenticateTokenFromCookie,
  authorizeCurrentUser,
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
      try {
        const storeData = await getContactStoreInformation();

        return res.status(400).render("contact", {
          title: "Contact Us",
          user: req.user,
          errors: errors.array(),
          input: req.body,
          ...storeData,
        });
      } catch (err) {
        console.error("Error fetching store information:", err);
        return res.status(500).render("contact", {
          title: "Contact Us",
          user: req.user,
          input: req.body,
          error: "We couldn't load the store information right now.",
          contactDetails: [],
          locationDetails: [],
          hours: [],
        });
      }
    }

    try {
      const submissionRepo = AppDataSource.getRepository(Submission);

      const submission = submissionRepo.create({
        userId: req.user.id,
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        subject: req.body.subject.trim(),
        message: req.body.message.trim(),
      });

      await submissionRepo.save(submission);

      const storeData = await getContactStoreInformation();

      return res.render("contact", {
        title: "Contact Us",
        user: req.user,
        input: {},
        success: "Thank you! Your inquiry has been submitted.",
        ...storeData,
      });
    } catch (err) {
      console.error("Error saving contact inquiry:", err);

      // Server/database error
      try {
        const storeData = await getContactStoreInformation();

        return res.status(500).render("contact", {
          title: "Contact Us",
          user: req.user,
          input: req.body,
          error: "We couldn't submit your inquiry right now. Please try again.",
          ...storeData,
        });
      } catch (storeErr) {
        console.error("Error fetching store information:", storeErr);

        return res.status(500).render("contact", {
          title: "Contact Us",
          user: req.user,
          input: req.body,
          error: "We couldn't submit your inquiry right now. Please try again.",
          contactDetails: [],
          locationDetails: [],
          hours: [],
        });
      }
    }
  },
);

//-------------------------END OF STORY 6 --------------------------------

app.get("/register", authenticateTokenFromCookie, (req, res) => {
  res.render(
    "account-auth", // handlebar template with both register and login forms
    {
      title: "Register",
      user: req.user,
      isRegister: true, // show the register form instead of the login form
    },
  );
});

app.post(
  "/register", // need to test trim
  [
    body("userName")
      .trim(" ")
      .isLength({
        min: 3,
        max: 20,
      })
      .withMessage(
        "Username is required and must be between 3 and 20 characters.",
      ),
    body("email")
      .isEmail()
      .withMessage("Email is invalid.")
      .normalizeEmail() // sanitize email address **
      // custom validation to check if the email trying to be registered already exists within our database
      .custom(async (value) => {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email: value });
        if (user) {
          throw new Error("This email is already registered.");
        }
        return true;
      }),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      ),
    body("confPassword")
      .custom((value, { req }) => {
        return value === req.body.password;
      })
      .withMessage("Passwords must match"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("account-auth", {
        title: "Register",
        user: req.user,
        isRegister: true,
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create(req.body);
    const result = await userRepository.save(user);

    //res.json(result);
    //res.redirect('/login'); // should I automatically login, or redirect to login after registering?
    // auto login after register is a better UX design in my opinion
    const token = jwt.sign(
      { id: result.id, userName: result.userName },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    // Set token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true if using HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.redirect("/");
  },
);

app.get(
  "/profile",
  authenticateTokenFromCookie,
  authorizeCurrentUser,
  async (req, res) => {
    // Current User data
    const userRepository = AppDataSource.getRepository(User);
    // Cascaded relations to be able to access the current users orders and items within those orders
    const result = await userRepository.findOne({
      where: { id: req.user.id },
      relations: {
        orders: {
          orderItems: {
            item: true,
          },
        },
      },
    });

    if (!result) {
      // This case should not occur because a valid token must be present to access the /profile route
      return res.json({ success: false, message: "User does not exist" });
    }

    console.log(result.orders);

    res.render("profile", {
      title: "Profile",
      user: req.user,
      email: result.email,
      orders: result.orders,
    });
  },
);

//#region Sucha Story here

app.get("/reviews", authenticateTokenFromCookie, async (req, res) => {
  if (!req.user) {
    return res.redirect("http://localhost:8000/login");
  }

  try {
    const reviewRepository = AppDataSource.getRepository(Review);
    const reviewsData = await reviewRepository.find({
      order: {
        reviewDate: "DESC",
      },
    });

    res.render("reviews", {
      title: "Reviews and Ratings",
      user: req.user,
      reviews: reviewsData,
    });
  } catch (err) {
    console.error(err);
    res.send("Error fetching data");
  }
});

app.post(
  "/reviews",
  authenticateTokenFromCookie,
  [
    body("rating").notEmpty().withMessage("Give Rating"),
    body("review").notEmpty().withMessage("You must enter review"),
    body("date").notEmpty().withMessage("You must enter the Visited Date"),
  ],
  async (req, res) => {
    if (!req.user) {
      return res.redirect("http://localhost:8000/");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Re-render form with errors and old input
      return res.render("reviews", {
        title: "Reviews and Ratings",
        user: req.user,
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    try {
      const reviewRepository = AppDataSource.getRepository(Review);
      const check = await reviewRepository.findOne({
        where: { userId: req.user.id },
      });

      if (check) {
        await reviewRepository.update(
          { userId: req.user.id }, // WHERE clause
          {
            rating: req.body.rating,
            review: req.body.review,
            visitDate: req.body.date,
          },
        );
      } else {
        const newReview = reviewRepository.create({
          userId: req.user.id,
          rating: req.body.rating,
          review: req.body.review,
          visitDate: req.body.date,
        });
        await reviewRepository.save(newReview);
      }

      const reviewsData = await reviewRepository.find({
        order: {
          reviewDate: "DESC",
        },
      });

      return res.render("reviews", {
        title: "Reviews and Ratings",
        user: req.user,
        reviews: reviewsData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create Review: " + error });
    }
  },
);

//#endregion


//------------Story 3 - Custom Orders - Roseanne Atchivara -------------
/*********** CUSTOM ORDERS ************
 * URL: http://localhost:8000/custom-orders
************************************/

/**
 * Categorizes the menu items from the repository
 * @returns an array of objects containing the category and an array of items in that cateogry
 */
async function loadCategorizedMenu() {
  //Fetch Menu from DB with sort
  const sortedMenu = await AppDataSource.getRepository(Menu).find(
    {
      order: {
        //sorts menu and groups them into categories first 
        category: "ASC",
        title: "ASC"
      }
    }
  )

  //Create an array of all the available categories in the Menu
  let categories = [];
  sortedMenu.forEach(item => {
    //if the category of the item doesn't exist in the categories array yet, add to categories
    if (!categories.includes(item.category))
    {
      categories.push(item.category);
    }
  });

  //For each categories, create an object containing the category name and 
  // a filtered (by category) array of items
  let categorizedMenu = [];
  categories.forEach(categoryName => {
    const items = sortedMenu.filter((item) => item.category === categoryName);
    categorizedMenu.push(
      { 
        name: categoryName,
        items: items
      }
    )
  });
  return categorizedMenu;
}

/**
 * Grabs tomorrow's date and formats it to use for 
 * HTML datetime-local's input's min="" property
 * Catering Order is set up so that the bakery has 24hrs in advance to prep the order!
 * @param {*} addMinutes extra minutes for default value in datetime-local min 
 * @returns string for input min="" property
 */
function tomorrowDate(addMinutes = 0)
{
  //Sets date to tomorrow's date
  const tomorrowsDate = new Date();
  tomorrowsDate.setDate( tomorrowsDate.getDate() + 1);
  tomorrowsDate.setTime( tomorrowsDate.getTime() + addMinutes * 60 * 1000);

  //Formatter
  const cateringDateFormatter = new Intl.DateTimeFormat("en-CA",
    {
      timeZone: "America/Regina",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
      hourCycle: "h23"
    }
  );
  return cateringDateFormatter.format(tomorrowsDate).replace(", ", "T");
}

//Fetch Menu and Store Info from DB
app.get('/custom-orders', authenticateTokenFromCookie, async (req, res) => {
  try {
    const categorizedMenu = await loadCategorizedMenu();
    //Using Garrett's function!
    const storeInfo = await getContactStoreInformation();

    //Render page
    res.render('custom-orders', {
      title: 'Place your Catering Order',
      user: req.user,
      menu_list: categorizedMenu,
      caterDate: tomorrowDate(5),
      caterMinDate: tomorrowDate(),
      storeInfo: storeInfo.locationDetails
    })
  } catch (err) {
    console.error("Error loading Custom Order Page:", err);

    return res.status(500).render("custom-orders", {
      title: "Error: Custom Order",
      user: req.user,
      menu_list: [],
      error: "Unable to load page"
    });
  }
});

app.post('/custom-orders', authenticateTokenFromCookie, authorizeCurrentUser, 
  [
    //Validation Rules
    //Cater date must not be empty, must be a valid date, and must be 24 hours in advance
    body("caterDate")
    .notEmpty().withMessage("Please enter a date.").bail()
    .isISO8601().withMessage("Please enter a valid date.").bail()
    .custom((val) => {
      return val >= tomorrowDate()
    }).withMessage("Please allow 24 hours notice to prepare your order."),

    // Order Quantities must be between 0 and 999
    body("quantities.*")
    .isInt( 
      {
        min: 0,
        max: 999
      }).withMessage("Item Quantity must be between 0 to 999"),

    // At least one of the quantities must be > 0
    body("quantities")
    .custom((val) => {
      const quantities = Object.values(val)
      .some((quantity) => {
        return Number(quantity) > 0
      });
      return quantities;
    }).withMessage("Must have at least 1 item that has more than 0 quantity."),

    // Special Instructions must be <= 255 and is optional
    body("specialInstructions")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Special Instructions must be 255 characters max.")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    //Validation
    if (!errors.isEmpty()) {
      try {
        const categorizedMenu = await loadCategorizedMenu();
        //Using Garrett's function!
        const storeInfo = await getContactStoreInformation();

        //If validation fails (errors)
        return res.status(400).render('custom-orders', {
          title: 'Place your Catering Order',
          user: req.user,
          menu_list: categorizedMenu,
          caterDate: req.body.caterDate,
          caterMinDate: tomorrowDate(),
          storeInfo: storeInfo.locationDetails,
          errors: errors.array(),
          input: req.body
        });
      } catch (err) {
          //If something goes wrong with loading (error)
          console.error("Error loading Custom Order Page:", err);
          
          return res.status(500).render("custom-orders", {
            title: "Error: Custom Order",
            user: req.user,
            menu_list: [],
            error: "Unable to load page"
          });
        }
    }

    try {
      const menu = AppDataSource.getRepository(Menu);
      const quantities = req.body.quantities;

      let totalPrice = 0;
      const orderItems = [];

      // key is the item, value is the quantity
      for (const item in quantities) {
        const quantity = Number(quantities[item]);
        if (quantity === 0) {
          // ignores all 0s
          continue;
        }

        //Added id in quantities' key to avoid losing key
        //it creates arrays instead of objects if the keys are just numbers
        const menuItem = await menu.findOneBy( { id: Number(item.replace("id", ""))} );
        if (!menuItem) {
          //just in case
          continue;
        }

        // Calculate item's price x quantity and add to total
        const price = Number(menuItem.price);
        const overallPrice = price * quantity;
        totalPrice += overallPrice;

        //Add this item's information in orderItems
        orderItems.push(
          {
            menuId: menuItem.id,
            title: menuItem.title,
            itemPrice: price,
            quantity: quantity,
            overallPrice: overallPrice.toFixed(2)
          }
        )
      }

      //Send order details to Order
      const order = AppDataSource.getRepository(Order);
      const newOrder = order.create(
        {
          userId: req.user.id,
          caterDate: req.body.caterDate,
          specialInstructions: req.body.specialInstructions,
          total: totalPrice
        }
      );
      await order.save(newOrder);

      //Send order item details to OrderItem
      const orderItem = AppDataSource.getRepository(OrderItem);

      for (const item of orderItems) {
          const newOrderItem = orderItem.create({
            orderId: newOrder.id,
            menuId: item.menuId,
            quantity: item.quantity,
            unitPrice: item.itemPrice
          }
        );

        await orderItem.save(newOrderItem);
      }

      //Using a different template for checkout
      return res.render('order-checkout', {
        title: "Order Placed",
        user: req.user,
        orderId: newOrder.id,
        orderItems: orderItems,
        total: totalPrice.toFixed(2),
        caterDate: req.body.caterDate.replace("T", " at "),
        specialInstructions: req.body.specialInstructions
      })
    } catch (err) {
      //If something goes wrong with loading (error)
      console.error("Error placing order:", err);
      
      return res.status(500).render("custom-orders", {
        title: "Error: Custom Order",
        user: req.user,
        menu_list: [],
        error: "We couldn't place your order. Please try again."
      });
    }
  }
);

//------------End of Story 3 - Roseanne Atchivara -------------

//------------Story 4 - Showcase Gallery - Multer - Kevin Obillo -------------

//store uploaded files on disk
const storage = multer.diskStorage({
  destination: "public/images/",
  filename: (req, file, callBack) =>
    callBack(null, file.originalname.toLowerCase()),
});

//File upload handler:
//only takes an image/ file
//if not an image file, it'll reject the file and will show an error
const showcaseUpload = multer({
  storage: storage,
  //limited of 2,097,152 or 2MB
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callBack) => {
    //file mime type -> image only
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
  const photos = await AppDataSource.getRepository(Showcase).find({
    relations: { user: true }, // this is going to load the uploader from user table
  });

  let filteredPhotos = photos;

  //if the user typed something in search, only keep photos that match
  if (search && search.trim().length) {
    const searchLower = search.toLowerCase();
    filteredPhotos = photos.filter(
      (photo) =>
        // if i want to search using the title or description?
        photo.title.toLowerCase().includes(searchLower) ||
        (photo.description &&
          photo.description.toLowerCase().includes(searchLower)), //check if the description exist first before searching it
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
    hasPhotos: photos.length > 0, // same logic we used for example lo2. using this below the upload button
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
  [
    //i want to add a validator for the title and description as well
    //when a user is uploading a picture, they can manually put the title
    //of what are they trying to upload + the description(optional only).
    //https://express-validator.github.io/docs/api/validation-chain/#notempty
    //validator chains
    //notEmpty -> checks if the title is NOT EMPTY
    //withMessage -> will set the error message if .notEmpty fails
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .custom((val) => {
        if (val.length > 50) {
          throw new Error("Title must be only 50 characters or less");
        }
        return true;
      }),
    //since i want the description to be 'only optional'
    //i dont need a validator here but i want to limit
    //the user's description?
    //https://express-validator.github.io/docs/api/validation-chain/#optional
    body("description")
      .optional()
      .custom((val) => {
        if (val.length > 250) {
          throw new Error("Description must only 250 characters or less");
        }
        return true;
      }),
  ],
  async (req, res) => {
    //for validation express i need to collect the error checks
    //https://express-validator.github.io/docs/6.0.0/validation-result-api/
    const errors = validationResult(req).array();

    //Multer adds req.file when a valid file is uploaded
    if (!req.file) {
      //if no file arrived, show to upload form again with an error message..
      errors.push({ msg: "Please upload a valid image file." }); // putting this error inside our errors arrays if file is not valid
    }

    if (errors.length > 0) {
      //if something is wrong, itll just show the page again with the errors
      const photos = await AppDataSource.getRepository(Showcase).find({
        relations: { user: true }, // added this aswell for the relations of my showcase
      });

      //so the photos that'll be shown is when it was uploaded - newest photos first
      photos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

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
      userId: req.user.id, // id of the logged in user, from Rylans token
    };

    //now if no errors and it was a successful upload
    //need to save the info to the data base
    await AppDataSource.getRepository(Showcase).save(photoInfo);
    //debugger -- delete later
    console.log("New showcase photo: ", photoInfo);

    //this will just redirect or refresh the page so the new photo shows up
    res.redirect("/showcase");
  },
);

//-------------------------END OF STORY 4 --------------------------------

// ---------------------------- STORY 2: SAMUEL CYRENNE ---------------------------------------------
app.get("/menu", authenticateTokenFromCookie, async (req, res) => {
    const menuRepository = await AppDataSource.getRepository(Menu);

    //grab all items in the menu
    const menuItems = await menuRepository.find();
    const { search, filter } = req.query;
    let filteredMenuItems = menuItems;

     filteredMenuItems.map((item)=>{
      console.log(item);
    });
   
    if (
        search
    ) //if search isnt empty, filter the query and return the new menu items
    {
        const menuSearchLower = search.toLowerCase(); //remove case-sensitivity from search results
        if (filter === "title") {
            filteredMenuItems = menuItems.filter((item) =>
                // if searching by item name [title]
                item.title.toLowerCase().includes(menuSearchLower)
            );
        } else if (filter === "category") {
            filteredMenuItems = menuItems.filter((item) =>
                // if searching by item category (like drink or food)
                item.category.toLowerCase().includes(menuSearchLower)
            );
        }
        else if (filter === "price") {
            filteredMenuItems = menuItems.filter((item) =>
                // if searching by price
                item.price.includes(menuSearchLower)
            );
        }
    }

   

   

    
    res.render("menu", {
        menuItems: filteredMenuItems,
        success: "",
        error: "",
        user: req.user
    });
});

//ADD NEW MENU ITEM
app.post(
    "/menu",
    authenticateTokenFromCookie,
    authorizeCurrentUser,
    [
        //https://express-validator.github.io/docs/api/validation-chain/#standard-validators
        //middleware - express-validator uses to create the "rules"
        body("itemName").trim().isLength({ min: 2 }).withMessage("Item title must be at least 2 characters")
            .isAlpha().withMessage("Title cannot be a number"),
        body("itemType").trim().isLength({ min: 2 }).withMessage("Item category must be at least 2 characters")
            .isAlpha().withMessage("Category cannot be a number"),
        body("itemPrice").trim().isLength({min: 1}).toFloat().
            isNumeric().withMessage("Item price must be a number")
    ],
    async (req, res) => {
        const validationError = validationResult(req);
        console.log(validationError);

        const menuRepository = await AppDataSource.getRepository(Menu);
        const errors = validationResult(req);

       
        
        const { itemName, itemType, itemPrice } = req.body; //the three form values

        //if validation error occurs, render the page with the error
        if  (!errors.isEmpty()) {
            return res.render("menu", {
                success: false,
                errors: errors.array(),
                 user: req.user,

            });
        }

       
        

        const newMenuItem = {
            title: itemName,
            category: itemType,
            userId: req.user.id, 
            price: itemPrice,
        };

        // Save this item to the database
        await menuRepository.save(newMenuItem);
        console.log("USER: " + req.user);

        // Render a third div, displaying the newly updated item
        res.render("menu", {
            success: true,
            error: null,
             user: req.user,
            newItem: {
                title : newMenuItem.title,
                category:  newMenuItem.category,
                price:  "$" + newMenuItem.price
            },
           
        });
    },
);

/*********** Start the server *************/
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
