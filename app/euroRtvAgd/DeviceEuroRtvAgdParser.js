const cheerio = require('cheerio');
let rp = require('request-promise');

const tvNameAndAddress = [];
let address, pageNumber = 1, urlList = [];
//let baseDomainName = 'https://www.euro.com.pl/telewizory-led-lcd-plazmowe,strona-';

/**
 *  
 * Parser urządzeń z witryny Euro AGD RTV 
 */
class DeviceListEuroRtvAgdParser {

    constructor() {
    }

    parse(html, baseDomainName) {
        const $ = cheerio.load(html);
        let page = $("div.paging-numbers")[1].childNodes.length;
        // if (page.length > 0) {
        //     page = $("div.paging-numbers")[1].childNodes.length;

        let newBaseDomainName = baseDomainName.slice(0, baseDomainName.length - 20);

        for (let i = 1; i <= page + 1; i+=2) {
            let url = newBaseDomainName + ',strona-' + pageNumber + '.bhtml';
            urlList.push({ url });
            pageNumber++;
        }
        // } else {
        //     urlList.push({ baseDomainName });
        // }


        let promises = urlList.map(url => {
            return rp(url).then(response => {
                return response
            }).catch(error => {
                return error
            })
        })

        return promises.reduce((promiseChain, currentTask) => {
            return promiseChain
                .then(chainResults => currentTask
                    .then(currentResult => chainResults = chainResults
                        .concat(currentResult)
                    )
                ).catch(err => {
                    return err;
                });;
        }, Promise.resolve(promises))
            .then(htmlBody => {
                //console.log(">>> htmlBody", htmlBody);
                htmlBody.forEach(html => {
                    const $ = cheerio.load(html);

                    let attrProductName = $("div.list div.product-box.js-UA-product");
                    let nameDiv = $("div.list div.product-box.js-UA-product h2.product-name");

                    for (let i = 0; i < attrProductName.length - 1; i++) {

                        let productName = attrProductName[i].attribs;
                        let name = nameDiv[i].children[1].children[0].nodeValue.trim();

                        address = 'https://www.euro.com.pl' + productName['data-product-href'];
                        tvNameAndAddress.push({ name, address, shop: 'euroRtvAgd' });
                    }

                })
                //console.log("tablica nazw i adresów adresow >>>", tvNameAndAddress);
                return tvNameAndAddress;

            })
            .catch(err => {
                console.error(">>> ERR :: ", err);
                return err;
            });
    }
}

module.exports = { DeviceListEuroRtvAgdParser }