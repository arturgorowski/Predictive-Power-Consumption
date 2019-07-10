const cheerio = require('cheerio');
let rp = require('request-promise');

const tvNameAndAddress = [];
let name, address, pageNumber = 1, iterator = 0, urlList = [];
let baseDomainName = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory?limit=100&page=';

/**
 * 
 * Parser urządzeń ze strony Media Markt 
 */
class DeviceListMediaMarktParser {

    constructor() {
        //super();
    }

    parse(html) {
        //console.time("get mediaMarkt data")
        const $ = cheerio.load(html);
        let page = $("a.m-pagination_item.m-pagination_next");

        for (let i = pageNumber; i <= page.length + 1; i++) {
            let url = baseDomainName + pageNumber;
            urlList.push({ url });
            pageNumber++;
        }

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
                );
        }, Promise.resolve(promises))
            .then(htmlBody => {
                //console.log(">>> htmlBody", htmlBody);

                htmlBody.forEach(html => {
                    const $ = cheerio.load(html);
                    let attrProductName = $("a.js-product-name");

                    for (let k = 0; k < attrProductName.length - 1; k++) {

                        let productName = attrProductName[k].attribs;
                        if (attrProductName[k].attribs.href !== attrProductName[k + 1].attribs.href) {
                            name = productName.title;
                            address = 'https://mediamarkt.pl' + productName.href;
                            tvNameAndAddress.push({ id: iterator, name, address });
                            iterator++

                        } else {
                            productName = attrProductName[k + 1].attribs;
                        }
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

module.exports = { DeviceListMediaMarktParser } 