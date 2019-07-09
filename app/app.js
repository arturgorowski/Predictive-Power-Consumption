const cheerio = require('cheerio');
let rp = require('request-promise');

const tvNameAndAddress = [];
let name, address, pageNumber = 1, iterator = 0, urlList = [], domainName, baseDomainName;
let addresses = []

/**
 *  
 * Wybranie listy do parsowania urządzeń
 */
class DeviceListParser {

    constructor() {
        console.log("HELLO FROM :: DeviceListParser");
    }

    /**
     * 
     * przyjmuje tablice listy urządzeń i tworzy tablice obiektów HTML poszczególnych urządzeń
     */
    getScrapperList(tvNameAndAddress) {

        tvNameAndAddress.forEach((address) => {
            addresses.push(address.address)
        })
        //console.log("addresses:", addresses)
        let promises = addresses.map(url => {
            //console.log(">>> url", url)
            return new Promise((resolve, reject) => {
                rp(url)
                    .then((response) => {
                        resolve(response)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            });
        })

        return promises.reduce((promiseChain, currentTask) => {
            return promiseChain
                .then(chainResults => currentTask
                    .then(currentResult => chainResults = chainResults
                        .concat(currentResult)
                    )
                )
                .catch(err => {
                    return err;
                });
        }, Promise.resolve(promises))
            .then(htmlBody => {
                console.log(">>> htmlBody", htmlBody);
                return htmlBody;
            })
            .catch(err => {
                console.error(">>> ERR :: ", err);
                return err;
            });
    }
}

/**
 * 
 * Stworzenie obiektu parsera dla konkretnego urządzenia
 */
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

const listScrapper = new DeviceListParser();

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
        let page = $("a.m-pagination_item.m-pagination_next");

        for (let i = pageNumber; i <= page.length + 1; i++) {
            let url = baseDomainName + pageNumber
            urlList.push({ url })
            pageNumber++
        }

        let promises = urlList.map(url => {
            return new Promise((resolve, reject) => {
                rp(url)
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
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
                console.log("tablica nazw i adresów adresow >>>", tvNameAndAddress);
                return tvNameAndAddress;

            })
            .catch(err => {
                console.error(">>> ERR :: ", err);
                return err;
            });
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
                tvNameAndAddress.push({ id: iterator, name, address });
                iterator++
            } else {
                productName = attrProductName[i + 1].attribs;
            }
        }
        // if (page.length > 0) {
        //     pageNumber++
        //     getPowerInformation(tvNameAndAddress)
        // }

        console.log("tablica nazw i adresów adresow >>>", tvNameAndAddress);
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
            tvNameAndAddress.push({ id: iterator, name, address });
            iterator++;
        }

        console.log("tablica nazw i adresów adresow >>>", tvNameAndAddress);
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
        baseDomainName = this.domain;
        console.log(this.domain);
        // this.pageNumber = pageNumber;

        // this.url = domain + pageNumber;

        // is mediamarkt, mediaexpert
        this.market = this.getMarketName();
    }

    /**
     * 
     * ustalenie nazwy marketu
     */
    getMarketName() {

        //@todo detekcja sklepu na podstawie domeny
        let urlType;
        if (this.domain.includes("mediamarkt")) urlType = 'mediamarkt';
        else if (this.domain.includes('mediaexpert')) urlType = 'mediaexpert';
        else if (this.domain.includes('euro')) urlType = 'eurortvagd';

        switch (urlType) {

            case 'mediamarkt':
                console.log('media markt here');
                domainName = this.domain + pageNumber
                return 'mediamarkt';
                break;

            case 'mediaexpert':
                console.log('media expert here');
                domainName = this.domain
                return 'mediaexpert';
                break;

            case 'eurortvagd':
                console.log('euro rtv agd here');
                domainName = this.domain
                return 'eurortvagd';
                break;
        }

    }

    /**
     * 
     * utworzenie tablicy obiektów HTML na podstawie listy urządzeń
     */
    getScrapperHtmlTab() {
        return new Promise((resolve, reject) => {
            this.getNameAndAddresses()
                .then(response => {
                    //console.log("response <<<", response)
                    resolve(listScrapper.getScrapperList(response))
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    /**
     * 
     * na podstawie strony bazowej sklepu(media markt/media expert/euro rtv agd) stworzenie listy urządzeń
     */
    getNameAndAddresses() {
        return new Promise((resolve, reject) => {
            rp(domainName)
                .then((html) => {
                    resolve(DeviceListParser.create(this.market).parse(html))
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }
}

// const request = new DeviceListUrlScrapper(mm);

// request.getNameAndAddresses()
//     .then(result => {
//         console.log("result <<<", result)
//         listScrapper.getScrapperList(result)
//     })
//     .catch(err => {
//         console.log(err);
//         return err;
//     })

// request.getScrapperHtmlTab()
//     .then(result => {
//         console.log(result)
//     })
//     .catch(error => {
//         return error
//     })

module.exports = { DeviceListUrlScrapper }