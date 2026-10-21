const express = require('express');
const {randomUUID} = require('crypto')
const exphbs = require('express-handlebars');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { AppDataSource } = require('./data-source');
const { User } = require('./entity/User');
const { users } = require('./fixtures/users');

// Create the Express app and configure key app-level settings.
const app = express();
const PORT = 8000;

const SECRET_KEY = 'mysecret';



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
}).then(async () =>{
  const userRepository = AppDataSource.getRepository(User); // get user repository
  await userRepository.clear(); // clear rows from userRepository so it can re-seed data
  const userEntities = userRepository.create(users); // Create objects based on User entity
  await userRepository.save(userEntities); // Save fake data to the database
})
.catch(err => console.error(err));



/*********** HOME PAGE ************
 * URL: http://localhost:8000/
 * Home page: displays learning concepts and sample student names.
***********************************/
app.get('/', authenticateTokenFromCookie, (req, res) => {
  res.render('home', {
    title: 'Coffee Shop Hub',
    user: req.user, // If there is no token this will be undefined and 
                    // result in a false in main.handlebars
	
    students:[ //TODO Add you team names alphabetically by first name (include First letter of Family name)
		{ name: 'Garrett T.', section: 'Contact & Hours'},
		{ name: 'Kevin O.', section: 'Showcase Gallery - Multer'},
		{ name: 'Roseanne A.', section: 'Custom Orders'},
    { name: 'Rylan W.', section: 'Auth & Profile'},
		{ name: 'Samuel C.', section: 'Menu Items'},
		{ name: 'Sucha S.', section: 'Customer Reviews'}
    ]
  });
});

/**
 * LOGIN GET request
 */
app.get('/login', (req, res) => {
  res.render('account-auth', {
    title: 'Login',
    user: req.user,
    isRegister: false
  });
});
app.post('/logout', (req, res) => {
            res.clearCookie('token');
            res.redirect('/'); // Not sure how to redirect back to the page you were on, but that might not be proper functionality anyway
          });

app.post('/login', async(req, res) => {
  const {id, userName, email, password } = req.body;
    // create repository
    const userRepository = AppDataSource.getRepository(User);
    // query the database to find a user based on the inputted email
    const user = await userRepository.findOneBy({ email: email });
    // check if that user exists and if the password matches
    if(user && password === user.password){
      // If password matches, log in and redirect
      // create JWT
      const token = jwt.sign({ id: user.id, userName: user.userName }, SECRET_KEY, { expiresIn: '1h' });
      // Set token in HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // set true if using HTTPS
        maxAge: 60 * 60 * 1000 // 1 hour
      });
      res.redirect('/');
    }
    else{
      return res.render('account-auth',
        {
          title: 'Login',
          user: req.user,
          isRegister: false,
          errors: [{"msg":"Email or password is incorrect"}],
          oldInput: req.body
        })
    }
})

app.get('/register', (req, res) => {
  res.render('account-auth',  // handlebar template with both register and login forms
  {
    title: 'Register',
    user: req.user,
    isRegister: true // show the register form instead of the login form
  });
});

app.post('/register', // need to test trim
  [
    body('userName')
    .trim(" ")
    .isLength({
      min: 3,
      max: 20
    })
    .withMessage('Username is required and must be between 3 and 20 characters.'),
    body('email')
    .isEmail()
    .withMessage('Email is invalid.')
    .normalizeEmail() // sanitize email address **
    // custom validation to check if the email trying to be registered already exists within our database
    .custom(async (value) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ email: value })
      if(user){
        throw new Error('This email is already registered.');
      }
      return true;
    }),
    body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1 ,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'),
    body('confPassword').custom((value, { req }) => {
      return value === req.body.password;
    }).withMessage('Passwords must match')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.render('account-auth',
        {
          title: 'Register',
          user: req.user,
          isRegister: true,
          errors: errors.array(),
          oldInput: req.body
        }
      )
    }
    const userInfo = {...req.body, id: randomUUID()};
    console.log('New User:', userInfo);
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create(req.body);
    const result = await userRepository.save(user);
    //res.json(result);
    //res.redirect('/login'); // should I automatically login, or redirect to login after registering?
    // auto login after register is a better UX design in my opinion
    const token = jwt.sign({ id: result.id, userName: result.userName }, SECRET_KEY, { expiresIn: '1h' });
      // Set token in HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // set true if using HTTPS
        maxAge: 60 * 60 * 1000 // 1 hour
      });
      res.redirect('/');
  }
)

app.get('/profile', authenticateTokenFromCookie, async (req, res) => {
  // Current User data
  const userRepository = AppDataSource.getRepository(User);
  // Cascaded relations to be able to access the current users orders and items within those orders
  const result = await userRepository.findOne({ 
    where: { id: req.user.id },
    relations: { 
      orders: {
        orderItems: {
          item: true
        }
      }
    }
  })
  if(!result){ // This case should not occur because a valid token must be present to access the /profile route
    return res.json({ success: false, message: "User does not exist" });
  }

  console.log(result.orders);


  res.render('profile', {
    title: 'Profile',
    user: req.user,
    email: result.email,
    orders: result.orders
  });
});

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

