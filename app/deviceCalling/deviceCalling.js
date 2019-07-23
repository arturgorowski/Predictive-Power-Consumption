const url = 'https://www.euro.com.pl/zestawy-kina-domowego1/yamaha-musiccast-rx-v485-czarny-pure-acoustics-nova-6-czarny.bhtml'
const rp = require('request-promise')

rp(url).then(response => {
    parseResponseHtml(response).then(response => {
        console.log(response)
    }).catch(err => {
        return err
    })
}).catch(err => {
    return err
})