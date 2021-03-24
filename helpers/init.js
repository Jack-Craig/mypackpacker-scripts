const RedisSMQ = require('rsmq')
require('dotenv').config()
startupPromise = new Promise((resolve, reject) => {
    const QUEUENAME = 'all_messages'
    const NAMESPACE = 'packpacker'

    const REDIS_HOST = process.env.REDIS_HOST
    const REDIS_PORT = process.env.REDIS_PORT
    const REDIS_PASS = process.env.REDIS_PASS

    let rsmq = new RedisSMQ({
        host: REDIS_HOST,
        port: REDIS_PORT,
        ns: NAMESPACE,
        password: REDIS_PASS
    })
    rsmq.createQueue({ qname: QUEUENAME }, err => {
        if (err) {
            if (err.name !== 'queueExists') {
                console.error(err)
                return reject(err)
            }
            console.log('Tried to create queue but it already exists.')
            return resolve(rsmq)
        }
        console.log('Queue created!')
        resolve(rsmq)
    })
})


module.exports = startupPromise