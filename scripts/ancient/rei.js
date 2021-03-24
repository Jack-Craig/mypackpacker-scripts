// Provider Scraper
const cheerio = require('cheerio')
const axios = require('axios')
const async = require('async')
const ProductModel = require('../models/product')
const SourceModel = require('../models/source')

// Helpers
// Params: Price string ("$19.12" or "$104.2 - $1632.2")
const splitPriceRange = (priceRange) => {
    let priceObj = {
        minPrice: "",
        maxPrice: ""
    }
    const priceArr = priceRange.split('-')
    priceObj.minPrice = parseFloat(priceArr[0].trim().replace('$', ''))
    if (priceArr.length > 1) {
        priceObj.maxPrice = parseFloat(priceArr[1].trim().replace('$', ''))
    }
    return priceObj
}

const cleanup = (mongoose) => {
    mongoose.disconnect()
}

const run = () => {
    const { mongoose, promise } = require('./mongooseLoader')()
    promise.then(result => {
        console.log('Mongo loaded')
        SourceModel.findById('rei').lean().then(sourceDoc => {
            let categoryCalls = []
            for (const category of sourceDoc.categories) {
                categoryCalls.push(categoryCallback => {
                    const categoryID = category._id
                    const reiCategoryUrl = category.url
                    console.log(categoryID, reiCategoryUrl)
                    axios.get(reiCategoryUrl).then(res => {
                        // TODO: Do pagination
                        const $ = cheerio.load(res.data)
                        const pageResults = $('._1COyDttDTR5M16ybKTmtJn')
                        let updateCalls = []
                        pageResults.children().each((i, elem) => {
                            const name = $(elem).find('h3.dl_7C8km92zuNzeZlZyS2').find('.r9nAQ5Ik_3veCKyyZkP0b').text()
                            const brandID = $(elem).find('h3.dl_7C8km92zuNzeZlZyS2').find('._1fwp3k8dh1lbhAAenp87CH').text()
                            const detailUrl = $(elem).find('._1A-arB0CEJjk5iTZIRpjPs').attr('href')
                            const priceRange = splitPriceRange($(elem).find('._1zwqhlCzOK-xETXwFg_-iZ').text())
                            const isAvailable = true
                            // TODO: Add detailed scrape on insert!
                            updateCalls.push(updateCallback => {
                                ProductModel.findByIdAndUpdate(detailUrl, {
                                    '$push': {
                                        [`priceInfo.${detailUrl}.priceHistory`]: {
                                            date: new Date(),
                                            priceRange: priceRange,
                                            isAvailable: isAvailable
                                        }
                                    },
                                    '$setOnInsert': {
                                        _id: detailUrl,
                                        displayName: name,
                                        categoryID: categoryID,
                                        fuzzyNames: [name],
                                        [`priceInfo.${detailUrl}.url`]: reiCategoryUrl
                                    }
                                }, { upsert: true }).lean().then(() => {
                                    updateCallback()
                                }).catch((err) => {
                                    console.log(err)
                                    cleanup(mongoose)
                                })
                            })
                        })
                        async.parallel(updateCalls, (err, result) => {
                            console.log('Finished page, calling category callback...')
                            if (err) {
                                console.log(err)
                            }
                            categoryCallback()
                        })
                    }).catch(err => {
                        console.log(err)
                        cleanup(mongoose)
                    })
                })
            }
            async.parallel(categoryCalls, (err, result) => {
                console.log('Category Setup Done')
                if (err) {
                    console.log(err)
                }
                cleanup(mongoose)
            })
        }).catch(err => {
            console.log(err)
            cleanup(mongoose)
        })

    }).catch(err => {
        console.log(err)
        cleanup(mongoose)
    })
}

console.log('Running REI.JS')
run()


