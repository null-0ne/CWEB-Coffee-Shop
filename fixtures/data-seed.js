 const { AppDataSource } = require('../data-source');
 const { Review } = require('../entity/Review');

 //Rylan
module.exports.users = [
  {
    "userName": "Johnnyboy",
    "email": "john@test.ca",
    "password": "Strong!Password1",
    "firstName": "John",
    "lastName": "Doe"
  },
  {
    "userName": "Janegirl",
    "email": "jane@test.ca",
    "password": "Strong!Password1",
    "firstName": "Jane",
    "lastName": "Doe"
  },
  {
    "userName": "Milly",
    "email": "mildred@test.ca",
    "password": "Strong!Password1",
    "firstName": "Mildred",
    "lastName": "Tanaka"
  },
  {
    "userName": "Tommyboy",
    "email": "thomas@test.ca",
    "password": "Strong!Password1",
    "firstName": "Thomas",
    "lastName": "Walsh"
  },
  {
    "userName": "Jo",
    "email": "johanna@test.ca",
    "password": "Strong!Password1",
    "firstName": "Johanna",
    "lastName": "Weidner"
  },
  {
    "userName": "Jelly",
    "email": "jelena@test.ca",
    "password": "Strong!Password1",
    "firstName": "Jelena",
    "lastName": "Stojanovic"
  },
  {
    "userName": "Carls",
    "email": "carlotta@test.ca",
    "password": "Strong!Password1",
    "firstName": "Carlotta",
    "lastName": "De Luca"
  },
  {
    "userName": "Bronny",
    "email": "bronwen@test.ca",
    "password": "Strong!Password1",
    "firstName": "Bronwen",
    "lastName": "Pugh"
  },
  {
    "userName": "JamJam",
    "email": "jamal@test.ca",
    "password": "Strong!Password1",
    "firstName": "Jamal",
    "lastName": "Okeke"
  },
  {
    "userName": "Trav",
    "email": "travis@test.ca",
    "password": "Strong!Password1",
    "firstName": "Travis",
    "lastName": "Gentry"
  },
  {
    "userName": "JakeTheSnake",
    "email": "jake@test.ca",
    "password": "Strong!Password1",
    "firstName": "Jake",
    "lastName": "Farnsworth"
  },
  {
    "userName": "Walt",
    "email": "walter@test.ca",
    "password": "Strong!Password1",
    "firstName": "Walter",
    "lastName": "Grimshaw"
  }
]

//Sucha
module.exports = async function reviews() {
    const users = [
        {
            userId: 101,
            rating: 5,
            review: 'Excellent experience',
            visitDate: '2026-01-18'
        },
        {
            userId: 102,
            rating: 4,
            review: 'friendly service.',
            visitDate: '2026-01-22'
        },
        {

            userId: 103,
            rating: 3,
            review: 'Average experience.',
            visitDate: '2026-02-02'
        },
        {

            userId: 104,
            rating: 5,
            review: 'Outstanding quality and great atmosphere.',
            visitDate: '2026-02-10'
        },
        {

            userId: 105,
            rating: 2,
            review: 'Service was slower than expected.',
            visitDate: '2026-02-18'
        },
        {

            userId: 106,
            rating: 4,
            review: 'Good value for money.',
            visitDate: '2026-03-01'
        },
        {

            userId: 107,
            rating: 5,
            review: 'One of the best experiences I have had.',
            visitDate: '2026-03-12'
        },
        {

            userId: 108,
            rating: 3,
            review: 'Decent experience but not exceptional.',
            visitDate: '2026-03-20'
        },
        {

            userId: 109,
            rating: 4,
            review: 'Clean environment and helpful staff.',
            visitDate: '2026-04-05'
        },
        {

            userId: 110,
            rating: 1,
            review: 'Did not meet expectations.',
            visitDate: '2026-04-11'
        },
        {

            userId: 111,
            rating: 5,
            review: 'Fantastic experience, would visit again.',
            visitDate: '2026-04-25'
        }
    
]
    const reviewRepository = AppDataSource.getRepository(Review);
    
    for (const user of users) {
        const existingUser = await reviewRepository.findOne({
            where: { userId: user.userId },
        });
        if(!existingUser)
        {
            const newUser = reviewRepository.create(user);
            await reviewRepository.save(newUser);
        }
        console.log(
        `${existingUser ? 'Created' : 'Skipped'} user: ${user.userId}`
        );
    }
}

//Kevin
module.exports.showcasePhotos = [
  {
    userName: 'Johnnyboy',
    fileName: 'seed-iced-americano.jpg',
    title: 'Iced Americano',
    description: 'Espresso shots topped with cold water for a light layer of crema, served over ice.',
  },
  {
    userName: 'Janegirl',
    fileName: 'seed-matcha.jpg',
    title: 'Iced Matcha Latte',
    description: 'Smooth and creamy green tea latte made with our matcha and milk, served over ice.',
  },
  {
    userName: 'Milly',
    fileName: 'seed-lemon-loaf.jpg',
    title: 'Lemon Loaf',
    description: 'Citrusy, buttery, moist lemon pound cake topped with a sweet icing.',
  },
  {
    userName: 'Jo',
    fileName: 'seed-pecan-pie.jpg',
    title: 'Pecan Pie',
    description: 'Buttery crust with a caramelized filling and toasted pecans. Crunchy and sweet.',
  },
  {
    userName: 'Jelly',
    fileName: 'seed-apple-crumble-pie.jpg',
    title: 'Apple Crumble Pie',
    description: 'Tender spiced apples baked under a golden, buttery crumble topping.',
  },
  {
    userName: 'Carls',
    fileName: 'seed-pumpkin-pie.jpg',
    title: 'Pumpkin Pie',
    description: 'Creamy pumpkin filling with warm fall spices, topped with whipped cream.',
  },
  {
    userName: 'Bronny',
    fileName: 'seed-cheese-danish.jpg',
    title: 'Cheese Danish',
    description: 'Flaky, buttery pastry with a soft, sweet cream cheese centre.',
  },
  {
    userName: 'JamJam',
    fileName: 'seed-ham-swiss-croissant.jpg',
    title: 'Ham and Swiss Croissant',
    description: 'Smoked ham and melted Swiss cheese in a buttery, flaky croissant.',
  },
  {
    userName: 'Trav',
    fileName: 'seed-cinnamon.jpg',
    title: 'Cinnamon Roll',
    description: null, // optional - shows the gallery works without a description
  },
  {
    userName: 'Walt',
    fileName: 'seed-coffee.jpg',
    title: 'Iced Latte',
    description: 'Rich espresso combined with milk and served over ice.',
  },
  {
    userName: 'Johnnyboy',
    fileName: 'seed-cortado.webp',
    title: 'Cortado',
    description: 'Equal parts espresso and steamed milk for a smooth, rich cup.',
  },
  {
    userName: 'Milly',
    fileName: 'seed-salted-caramel.jpg',
    title: 'Salted Caramel Cream Cold Brew',
    description: 'Smooth cold brew with a touch of caramel, topped with a salted cold foam.',
  },
  {
    userName: 'Tommyboy',
    fileName: 'seed-pumpkin-cold-brew.jpg',
    title: 'Pumpkin Cream Cold Brew',
    description: 'Cold brew topped with pumpkin cream cold foam.',
  },
];


