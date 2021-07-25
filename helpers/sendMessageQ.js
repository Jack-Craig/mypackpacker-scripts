module.exports = (mObj, qname) => {
    require('./init').then(rsmq => {
        rsmq.sendMessage({
            qname: qname,
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