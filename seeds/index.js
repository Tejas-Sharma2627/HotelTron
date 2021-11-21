const mongoose = require("mongoose");
const Hotels = require("../models/hotels");
const cities = require('./cities');
const { places, descriptors } = require("./seedHelpers");
mongoose
  .connect("mongodb://localhost:27017/hotelTron", {
    useNewUrlParser: true,
    //   useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION DONE");
  })
  .catch((err) => {
    console.log("MONGO ERROR ERROR ERROR");
    console.log(err);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = array=> array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await Hotels.deleteMany({});
    for(let i = 0;i<50;i++){
        const random = Math.floor(Math.random()*1468);
        const randPrice = Math.floor(Math.random()*5000)+1000;
        const hotel = new Hotels({
          location: `${cities[random].city}, ${cities[random].state}`,
          name: `${sample(descriptors)} ${sample(places)}`,
          image: 'https://source.unsplash.com/collection/483251',
          descr: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident quod obcaecati exercitationem labore fugit aliquid dolorem eum cumque, repudiandae reiciendis!",
          price:randPrice
        });
        await hotel.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});