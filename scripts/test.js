const start = () => {
    require('../helpers/init').then(rsmq => {
        console.log('Init done, sending message!')
        rsmq.sendMessage({
            qname: 'all_messages',
            message: 'Ello Govna!',
            delay: 0
        }, (err, cvVal) => {
            if (err) {
                console.error(err)
                return rsmq.quit()
            }
            console.log(cvVal)
            rsmq.quit()
        })
    }).catch(err => {
        console.error(err)
        console.log('Failed in initiation!')
    })
}
start()
console.log('Done with script')