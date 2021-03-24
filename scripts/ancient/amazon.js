// Leech Scraper
const cheerio = require('cheerio')
const axios = require('axios')
require('./mongooseLoader')['promise']()
const ProductModel = require('../models/product')

const run = () => {
    // Get all products, iterate through, and add an Amazon entry for each
    const productList = ProductModel.find({}).project({_id: 1, 'priceInfo.amazon': 1}).lean()

    for (const product of productList) {
        const id = product._id
        const priceInfo = product.priceInfo.amazon

        // If priceInfo, if so use that page to scrape price info

        // Else, use search function to search product name, and use fuzzy search to find matches
        // Maybe fuzzy search each word? and see how many match? test this
    }
}

run()