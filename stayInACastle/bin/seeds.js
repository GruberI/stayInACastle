const mongoose = require("mongoose");
const Castle = require("../models/castle.model");

const DB_NAME = "stayinacastle";
mongoose
  .connect(`mongodb://localhost/${DB_NAME}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const castles = [
    {
        name: "Lough Eske Castle",
        country: "Ireland",
        address: "Donegal Town, Co. Donegal, F94 HX59",
        image: "stayInACastle/public/images/test-castle.jpg",
        capacity: 2,
        link: "https://www.lougheskecastlehotel.com/",
        description: "Lough Eske Castle offers a selection of 97 magnificent 5 star rooms and suites that will make choosing accommodation in County Donegal easy. Each room complements the restoration of the castle and is sensitive to its history and location, making for superior castle accommodation in Ireland. Maximum use is made of natural light, natural materials and fabrics so that our guests, while cocooned in luxury, never feel far removed from the landscape around them. "
    },
]

Castle.create(castles)
.then((castleFromDB) => {
    console.log(`Created ${castleFromDB.length} castle`);
    mongoose.connection.close();
  })
  .catch((err) =>
    console.log(`An error occurred while getting castles from the DB: ${err}`)
  ); 