const start = (mObj) => {
    require('./init').then(rsmq => {
        rsmq.sendMessage({
            qname: 'all_messages',
            message: JSON.stringify(mObj),
            delay: 0
        }, (err, cbV) => {
            if (err) {
                console.error(err)
                return rsmq.quit()
            }
            rsmq.quit()
        })
    }).catch(err => {
        console.error(err)
        console.log('Failed in initiation!')
    })
}
module.exports = start