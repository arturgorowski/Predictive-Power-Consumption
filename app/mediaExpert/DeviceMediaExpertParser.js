const cheerio = require('cheerio');
let rp = require('request-promise');

const tvNameAndAddress = [];
let name, address, pageNumber = 0, iterator = 0, urlList = [];
let baseDomainName = 'https://www.mediaexpert.pl/telewizory?per_page=20&start=';

/**
 * 
 * Parser urządzeń ze strony Media Expert 
 */
class DeviceListMediaExpertParser {

    constructor() {
    }

    parse(html) {
        const $ = cheerio.load(html);
        let page = $("input.js-jumpToPage")[0].attribs['data-lpage']

        for (let i = 1; i <= page; i++) {
            let url = baseDomainName + pageNumber;
            urlList.push({ url });
            pageNumber += 20;
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
        }, Promise.resolve(promises)).then(htmlBody => {
            //console.log(">>> htmlBody", htmlBody);
            htmlBody.forEach(html => {
                const $ = cheerio.load(html);

                let attrProductName = $("div.c-offerBox_header.clearfix2 a");

                for (let i = 0; i < attrProductName.length - 1; i++) {

                    let productName = attrProductName[i].attribs;
                    if (attrProductName[i].attribs.href !== attrProductName[i + 1].attribs.href && attrProductName[i].attribs.class !== 'c-reviewStars_link under_off js-gtmEvent_click') {
                        name = productName.title;
                        address = 'https://mediaexpert.pl' + productName.href;
                        tvNameAndAddress.push({ id: iterator, name, address });
                        iterator++
                    } else {
                        productName = attrProductName[i + 1].attribs;
                    }
                }
            })
            //console.log("tablica nazw i adresów adresow >>>", tvNameAndAddress);
            return tvNameAndAddress;

        }).catch(err => {
            console.error(">>> ERR :: ", err);
            return err;
        });
    }
}

module.exports = { DeviceListMediaExpertParser }