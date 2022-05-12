const express = require('express')
const res = require('express/lib/response')
const MongoClient = require('mongodb').MongoClient

const app = express()
app.use(express.json())
var database

app.get('/',(req,resp)=> {
    resp.send('Welcome to mongoDb API')
})

app.get('/api/products',(req,resp) => {
    database.collection('products').find({}).toArray((err,result) =>{
        if(err) throw error
        resp.send(result)
    })
})

app.get('/api/products/:product',(req,resp) => {
    database.collection('products').find({product: req.params.product}).toArray((err,result)=> {
        if(err) throw err
        resp.send(result)
    })
})

app.post('/api/products/addProduct', (req,resp)=> {
    let res = database.collection('products').find({}).sort({price: -1}).limit(1)
    res.forEach(obj =>{
        if(obj){
            let b = {
                product: req.body.product,
                price: req.body.price
            }
            database.collection('products').insertOne(b,(err,result)=> {
                if(err) resp.status(500).send(arr)
                resp.send("added successfully")
            })
        }
    }) 
})

app.put('/api/products/:product',(req,resp) => {
    let query = {product: req.params.product}
    let b = {
        product: req.params.product,
        price: req.body.price
    }
    let dataSet = {
        $set: b
    }
    database.collection('products').updateOne(query,dataSet, (err, result) => {
        if(err) throw err
        resp.send(b)
    })
})

app.delete('/api/products/:product', (req, resp) => {
    database.collection('products').deleteOne({product: req.params.product}, (err, result) => {
        if(err) throw err
        resp.send("Product Deleted Successfully")
    })
})

app.listen(8080, () => {
   MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true}, (error, result) =>{
       if(error) throw error
       database = result.db('mydatabase')
       console.log('Connection succesful')
   }) 
})