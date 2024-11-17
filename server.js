//load express
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const dotenv = require("dotenv"); //require package
dotenv.config(); //loads the environment variables from.env file

const mongoose = require("mongoose"); //require package
mongoose.connect(process.env.MONGODB_URI);
//log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`connected to MongoDB`);
});
// Import the Food model
const Food = require("./models/food");

//DB connection code

app.get("/", async (req, res) => {
  res.render("index.ejs");
}),
  //get/food/new
  app.get("/food/new", (req, res) => {
    res.render("food/new.ejs");
  });
//  app.get("/food/:foodId", (req, res) => {
//    res.send(
//      `This route renders the show page for food id: ${req.params.foodId}!`
//    );
//  });

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

// app.post('/food/new'),async(req,res)=>{
//     console.log(req.body);
//     res.redirect('/food/new');
// };

//  app.post("/food", (req, res) => {
//    console.log(req.body); // 调试表单提交的数据
//    res.send("Check terminal for submitted data");
//  });

app.post("/food", async (req, res) => {
  try {
    const foodData = {
      name: req.body.name,
      like: req.body.like === "true",
    };
    // create food
    const newFood = await Food.create(foodData);
    console.log("saved to database", newFood);
    res.redirect("/food/new");
  } catch (error) {
    console.error("Error creating food:", error);
    res.status(500).send("Failed to add food to database");
  }
});

//find all food

app.get("/food", async (req, res) => {
  try {
    const allFood = await Food.find();
    res.render("food/index.ejs", { food: allFood });
  } catch (error) {
    console.error(error);
    res.send("There was an error getting all food");
  }
});

//find food by id
app.get("/food/:foodId", async (req, res) => {
  try {
    console.log(111);
    const foundFood = await Food.findById(req.params.foodId);
    res.render("food/show.ejs", { food: foundFood });
    
  } catch (error) {
    console.error(error);
    res.status(418).send("There was an error with finding a new food");
  }
});

//delete food
app.delete("/food/:foodId", async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.foodId);
    res.redirect("/food");
    console.log(deletedFood);
  } catch (error) {
    console.error(error);
    res.status(500).send("There was an error with deleting a new food ");
  }
});

//GET localhost:3000/foods/:foodId/edit
app.get("/food/:foodId/edit", async (req, res) => {
    
  try {
    const foundFood = await Food.findById(req.params.foodId);
    res.render('food/edit.ejs',{food:foundFood});
  } catch (error) {
    console.error(error);
    res.status(500).send("There was an error with updating food ");
  }
});

app.put("/food/:foodId", async (req, res) => {
  // Handle the radio box
try{
  const updatedData ={
     name:req.body.name,
     like:req.body.like === "true",
  };

  // Update the food in the database
  await Food.findByIdAndUpdate(req.params.foodId, updatedData);

  // Redirect to the food's show page to see the updates
  res.redirect(`/food/${req.params.foodId}`);
  }catch(error) {
    console.error(error);
    res.status(500).send("There was an error with updating food ")};
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
