const cheerio = require('cheerio');
let rp = require('request-promise');

const tvNameAndAddress = [];
let name, address, pageNumber = 1, iterator = 0;

/**
 *  
 * Wybranie listy do parsowania urządzeń
 */
class DeviceListParser {

    constructor() {
        console.log("HELLO FROM :: DeviceListParser");

    }
}

DeviceListParser.create = (market) => {

    switch (market) {

        case "mediamarkt":
            return new DeviceListMediaMarktParser();
            break;

        case "mediaexpert":
            return new DeviceListMediaExpertParser();
            break;

        case "eurortvagd":
            return new DeviceListEuroRtvAgdParser();
            break;
    }
}

/**
 * 
 * Parser urządzeń ze strony Media Markt 
 */

class DeviceListMediaMarktParser extends DeviceListParser {

    constructor() {
        super();
    }

    parse(html) {
        const $ = cheerio.load(html);

        let attrProductName = $("a.js-product-name");
        let page = $("a.m-pagination_item.m-pagination_next");

        // for (let i = 0; i < attrProductName.length - 1; i++) {

        //     let productName = attrProductName[i].attribs;
        //     if (attrProductName[i].attribs.href !== attrProductName[i + 1].attribs.href) {
        //         name = productName.title;
        //         address = 'https://mediamarkt.pl' + productName.href;
        //         tvNameAndAddress.push({ i, name, address });

        //     } else {
        //         productName = attrProductName[i + 1].attribs;
        //     }
        // }
        let iter = 1
        if (iterator <= page.length) {
            pageNumber++
            iterator++
            for (let i = 0; i < attrProductName.length - 1; i++) {

                let productName = attrProductName[i].attribs;
                if (attrProductName[i].attribs.href !== attrProductName[i + 1].attribs.href) {
                    name = productName.title;
                    address = 'https://mediamarkt.pl' + productName.href;
                    tvNameAndAddress.push({ iter, name, address });
                    iter++

                } else {
                    productName = attrProductName[i + 1].attribs;
                }
            }

            const recursion = new DeviceListUrlScrapper(mm + pageNumber);
            recursion.getNameAndAddresses()
                .then(result => {
                    console.log("result >>> ", result);
                })

        }

        //console.log("tablica adresow >>>", tvNameAndAddress);
        else return tvNameAndAddress;
    }

}

/**
 * 
 * Parser urządzeń ze strony Media Expert 
 */

class DeviceListMediaExpertParser extends DeviceListParser {

    constructor() {
        super();
    }

    parse(html) {
        const $ = cheerio.load(html);

        let attrProductName = $("div.c-offerBox_header.clearfix2 a");
        // $("div.c-offerBox_header.clearfix2 a").map((k,v)=> `https://mediaexpert.pl${$(v).attr("href")}`)
        //let page = $("a.m-pagination_item.m-pagination_next")

        for (let i = 0; i < attrProductName.length - 1; i++) {

            let productName = attrProductName[i].attribs;
            if (attrProductName[i].attribs.href !== attrProductName[i + 1].attribs.href && attrProductName[i].attribs.class !== 'c-reviewStars_link under_off js-gtmEvent_click') {
                name = productName.title;
                address = 'https://mediaexpert.pl' + productName.href;
                tvNameAndAddress.push({ i, name, address });

            } else {
                productName = attrProductName[i + 1].attribs;
            }
        }
        // if (page.length > 0) {
        //     pageNumber++
        //     getPowerInformation(tvNameAndAddress)
        // }
        //getPowerInformation(tvNameAndAddress)
        console.log(tvNameAndAddress);
        return tvNameAndAddress;
    }

}

/**
 *  
 * Parser urządzeń ze strony Euro AGD RTV 
 */

class DeviceListEuroRtvAgdParser extends DeviceListParser {

    constructor() {
        super();
    }

    parse(html) {
        const $ = cheerio.load(html);

        let attrProductName = $("div.list div.product-box.js-UA-product");
        let nameDiv = $("div.list div.product-box.js-UA-product h2.product-name");

        for (let i = 0; i < attrProductName.length - 1; i++) {

            let productName = attrProductName[i].attribs;
            let name = nameDiv[i].children[1].children[0].nodeValue.trim();

            address = 'https://www.euro.com.pl' + productName['data-product-href'];
            tvNameAndAddress.push({ i, name, address });
        }
        //getPowerInformation(tvNameAndAddress);
        console.log(tvNameAndAddress);
        return tvNameAndAddress;
    }
}

/**
 * 
 * Utworzenie tablicy z adresami URL i nazwami urządzeń 
 */
class DeviceListUrlScrapper {
    constructor(domain) {
        this.domain = domain;
        console.log(this.domain);
        // this.pageNumber = pageNumber;

        // this.url = domain + pageNumber;

        // is mediamarkt, mediaexpert
        this.market = this.getMarketName();

    }

    getMarketName() {

        //@todo detekcja sklepu na podstawie domeny
        let urlType;
        if (this.domain.includes("mediamarkt")) urlType = 'mediamarkt';
        else if (this.domain.includes('mediaexpert')) urlType = 'mediaexpert';
        else if (this.domain.includes('eurortvagd')) urlType = 'eurortvagd';

        switch (urlType) {

            case 'mediamarkt':
                console.log('media markt here');
                return 'mediamarkt';
                break;

            case 'mediaexpert':
                console.log('media expert here');
                return 'mediaexpert';
                break;

            case 'eurortvagd':
                console.log('euro rtv agd here');
                return 'eurortvagd';
                break;
        }

    }

    getNameAndAddresses() {
        return new Promise((resolve, reject) => {
            rp(this.domain)
                .then((html) => {
                    resolve(DeviceListParser.create(this.market).parse(html))
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }
}

const mm = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory?limit=100&page=';
const me = 'https://www.mediaexpert.pl/telewizory/';
const era = 'https://www.euro.com.pl/telewizory-led-lcd-plazmowe.bhtml?link=mainnavi';

// const dp = new DeviceListUrlScrapper(mm + pageNumber);

// dp.getNameAndAddresses()
//     .then(result => {
//         console.log("result >>> ", result);
//     })

module.exports = { DeviceListUrlScrapper }