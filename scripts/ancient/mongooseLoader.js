const loadMongo = () => {
    const mongoose = require('mongoose')
    return {
        mongoose: mongoose,
        promise: mongoose.connect('mongodb+srv://admin:jgnvxuXcDSVqvTWa@packpack.brsdz.mongodb.net/packpack?retryWrites=true&w=majority'),
    }
}

module.exports = loadMongo