require("dotenv").config();
const express = require("express")
const db = require("./db")
const morgan = require("morgan")
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())


app.use((req, res, next) => {
  console.log("middleware test");
  next();
});
app.use(morgan("tiny"))



app.get("/api/v1/restaurants", async (req, res) => {
  
  try {
    const results = await db.query('select * from restaurants')
  console.log(results);
  res.json({
    status: "success",
    results: results.rows.length,
    data: {
      restaurant: results.rows,

    },
  });

  } catch (err) {
    console.log(err)
    
  }
 
});
 
//Get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const results = await db.query("select * from restaurants where id = $1", [req.params.id])
   
    res.json({
    status: "success",
    data: {
      restaurant: results.rows[0],
    }
  })}
  
  catch (err) {
    console.log(err);
  }
  
});
//create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  console.log(req.body);
  try {
    const results = await db.query("INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      [req.body.name, req.body.location, req.body.price_range]);
    console.log(results);
    res.status(201).json({
    status: "success",
    data: {
      restaurant: results.rows[0],
    },
  });
  } catch (err) {
    console.log(err)
  }
  
});

app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = db.query("DELETE FROM restaurants where id = $1", [req.params.id]);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err)
  }
});

//update restaurants
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *", [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );
    console.log(results);
    res.status(200).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });

  } catch (err) {
    console.log(err)
  }
  console.log(req.params.id);
  console.log(req.body);
  
});



const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server is up and listening port ${port}`)
});
