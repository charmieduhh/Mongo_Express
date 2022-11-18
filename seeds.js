//file that's run on its own everytime you want to get new data in db
//seeds db separately from web app to isolate from index of web app

const moongoose = require('mongoose')
const Product = require('./models/product')

const mongoose = require('mongoose');
main().catch(err => {
    console.log(err);
    console.log('OH NO, MONGO CONNECTION ERROR!')
})
async function main() {
    await mongoose.connect('mongodb://localhost:27017/farmStand'); //can add any title after local host
    console.log('MONGO CONNECTION OPEN!!')
}

//const p = new Product({
//    name: 'Ruby Grapefruit',
//    price: 1.99,
//    category: 'fruit'
//})
//p.save() 
//.then(p => {
//    console.log(p)
//})
//.catch(e => {
//    console.log(e)
//})

const seedProducts = [
    {
        name: 'Fairy Eggplant',
        price: 1.00,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 3.99,
        category: 'fruit'
    },
    {
        name: 'Organic Celery',
        price: 1.50,
        category: 'vegetable'
    },
    {
        name: 'Chocolate Whole Milk',
        price: 2.69,
        category: 'dairy'
    },
]

Product.insertMany(seedProducts)
.then(res => {
    console.log(res)
})
.catch(e => {
    console.log(e)
})