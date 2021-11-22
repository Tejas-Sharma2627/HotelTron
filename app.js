const express = require("express");
const app = express();
const joi = require("joi");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const Hotels = require("./models/hotels");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");

app.use(express.urlencoded({ extended: true }));
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
  const validateHotel = (req, res, next) => {
    const hotelValidator = joi.object({
      // Hotels: joi.object({
        name: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        image: joi.string().required(),
        descr: joi.string().required(),
      // }).required,
    });
    console.log(hotelValidator,req.body)
    const { error } = hotelValidator.validate(req.body);
    if (error) {
      const msg = error.details.join(",");
      throw new ExpressError(msg, 404);
    }
    else{
      next();
    }
  };
app.use(methodOverride("_method"));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("hotels/home");
});

app.get(
  "/allHotels",
  catchAsync(async (req, res) => {
    const hotel = await Hotels.find({});
    res.render("hotels/index", { hotel });
  })
);

app.get("/allHotels/new", (req, res) => {
  res.render("hotels/new");
});

app.post(
  "/allHotels",
  catchAsync(async (req, res, next) => {
    const newHotel = new Hotels(req.body.hotel);
    await newHotel.save();
    res.redirect(`/allHotels/${newHotel._id}`);
  })
);
app.get("/allHotels/:id", async (req, res) => {
  const result = await Hotels.findById(req.params.id);
  res.render("hotels/show", { result });
});
app.get(
  "/allHotels/:id/edit",
  catchAsync(async (req, res) => {
    const result = await Hotels.findById(req.params.id);

    res.render("hotels/edit", { result });
  })
);

app.put(
  "/allHotels/:id",validateHotel,
  catchAsync(async (req, res) => {
    const result = await Hotels.findByIdAndUpdate(
      req.params.id,
      { ...req.body.hotel },
      { new: true }
    );
    res.redirect(`/allHotels/${result._id}`);
  })
);

app.delete(
  "/allHotels/:id",
  catchAsync(async (req, res) => {
    const result = await Hotels.findByIdAndDelete(req.params.id);
    res.redirect("/allHotels");
  })
);

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error", { err });
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.listen(8080, () => {
  console.log("Serving on PORT 8080");
});
