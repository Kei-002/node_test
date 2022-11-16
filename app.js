require("dotenv").config();
const express = require("express");
const app = express();

const cors = require('cors')
// const mysql = require("mysql");
const Joi = require("joi")

const itemRoutes = require("./routes/item")
const orderRoutes = require("./routes/order")
const api = process.env.API_URL

app.use(express.json())
app.use(cors())
app.use(`${api}/items`, itemRoutes)
app.use(`${api}/orders`, orderRoutes)
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

const schema = Joi.object( {
    name: Joi.string().min(3).required()
})


// var con = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// });

// con.connect()
// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });

app.get("/", (req, res) => {
  res.send("this is it dead 5000");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 4]);
});

// Customers
const customers = [
  { id: 1, name: "john" },
  { id: 2, name: "mike" },
  { id: 3, name: "bron" },
];

app.get("/api/customer", (req, res) => {
  res.send(customers);
  // res.status(200).send(req.query.name)
});

app.get('/api/customer/:id', (req, res) => {
    // gets id in url
    // res.send(req.params.id)

    // res.status(200).send(req.query.name)

    const customer = customers.find(c => c.id === parseInt(req.params.id))
    // const customer = customers.find(c => { 
    //     console.log(c)
    //     return c.id === parseInt(req.params.id) 
    // })
    if (!customer) res.status(404).send('customer not found')
    res.send(customer)
})

// post request
// app.post('/api/customers',(req, res)=> {
//     const customer = {
//         id: customers.length + 1,
//         name: req.body.name
//     }
//     customers.push(customer)
//     res.send(customer)
// })



app.post('/api/customers',(req, res)=> {
    const result = schema.validate(req.body)
    console.log(result)
    if (result.error) {
        // res.status(400).send(result.error)
        res.status(400).send(result.error.details[0].message)
        return;
    }
    const customer = {
        id: customers.length + 1,
        name: req.body.name
    }
    customers.push(customer)
    res.send(customer)
})


function validateCustomer(customer) {
    const schema = Joi.object( {
        name: Joi.string().min(3).required()
    })
    return schema.validate(customer)
}

app.put('/api/customer/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id))
    if (!customer) res.status(404).send('Customer not found')

    const result = validateCustomer(req.body)
    return res.send(result)
    // if (result.error) {
    //     res.status(400).send(result.error.details[0].message)
    //     return
    // }

    // customer.name = req.body.name
    // res.send(customer)
})

// delete customer
app.delete('/api/customer/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id))
    if (!customer) return res.status(404).send('Customer not found')

    const index = customers.indexOf(customer)
    customers.splice(index, 1)
    res.send(customer)
})



















// server
// app.listen(3000, ()  => console.log('listening on port 3000...'))
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
