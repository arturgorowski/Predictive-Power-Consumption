const cheerio = require('cheerio');
let rp = require('request-promise');
let allUrlData = require('./allUrlData')

const DeviceListMediaMarktParser = require('../app/mediaMarkt/DeviceMediaMarktParser').DeviceListMediaMarktParser;
const DeviceListMediaExpertParser = require('../app/mediaExpert/DeviceMediaExpertParser').DeviceListMediaExpertParser;
const DeviceListEuroRtvAgdParser = require('../app/euroRtvAgd/DeviceEuroRtvAgdParser').DeviceListEuroRtvAgdParser;


let pageNumberME = 0, pageNumberMM = 1, domainName, baseDomainName;
let addresses = [];

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
     * przyjmuje tablice listy urządzeń(nazwa + adres URI) i tworzy tablice obiektów HTML poszczególnych urządzeń
     */
    getScrapperList(tvNameAndAddress) {

        tvNameAndAddress.forEach((item) => {
            addresses.push({address: item.address, type: item.type, shop: item.shop, model: item.model})
        })

        let it = 1;
        let promises = addresses.map(url => {
            return new Promise((resolve, reject) => {

                setTimeout(function () {
                    let options = {
                        method: 'GET',
                        uri: url.address,
                        //proxy: 'http://77.119.237.96:40224',
                        insecure: true,
                        rejectUnauthorized: false,
                        headers: {
                            'User-Agent': 'Request-Promise'
                        }
                    }
                    rp(options).then((response) => {
                        console.log(it++)
                        resolve({response, type: url.type, shop: url.shop, model: url.model})
                    }).catch((error) => {
                        console.log("ERR getScrapperList >>>", error)
                        reject(error)
                    });

                }, 2 * 1000)
            })
        })

        return promises.reduce((promiseChain, currentTask) => {
            return promiseChain
                .then(chainResults => currentTask
                    .then(currentResult => chainResults = chainResults
                        .concat(currentResult))
                ).catch(err => {
                    return err;
                });
        }, Promise.resolve(promises)).then(htmlBody => {
            //console.log(">>> htmlBody", htmlBody.length);
            return htmlBody;
        }).catch(err => {
            console.error(">>> ERR :: ", err);
            return err;
        });
    }
}

/**
 * 
 * wybór parsera dla konkretnego urządzenia
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

//const listScrapper = new DeviceListParser();

/**
 * 
 * Utworzenie tablicy z adresami URL i nazwami urządzeń 
 */
class DeviceListUrlScrapper {

    constructor(domain) {
        this.baseDomainName = domain;
        this.domain = domain;
        

        // is mediamarkt, mediaexpert
        this.market = this.getMarketName();
    }

    /**
     * 
     * detekcja sklepu na podstawie domeny
     */
    getMarketName() {

        let urlType;
        if (this.domain.includes("mediamarkt")) urlType = 'mediamarkt';
        else if (this.domain.includes('mediaexpert')) urlType = 'mediaexpert';
        else if (this.domain.includes('euro')) urlType = 'eurortvagd';

        switch (urlType) {

            case 'mediamarkt':
                console.time("get mediaMarkt data")
                console.log('media markt here');
                this.domain = this.domain + pageNumberMM
                console.log(this.domain);
                return 'mediamarkt';
                break;

            case 'mediaexpert':
                console.time("get mediaExpert data")
                console.log('media expert here');
                this.domain = this.domain + pageNumberME
                console.log(this.domain);
                return 'mediaexpert';
                break;

            case 'eurortvagd':
                console.time("get euroRtvAgd data")
                console.log('euro rtv agd here');
                this.domain = this.domain
                console.log(this.domain);
                return 'eurortvagd';
                break;
        }
    }

    /**
     * 
     * na podstawie listy urządzeń(nazwa + adres URI) stworzenie tablicy obiektów <html...>
     */
    getScrapperHtmlTab() {
        return this.getNameAndAddresses().then(response => {
            console.log(response)
            //return listScrapper.getScrapperList(response);
            return response;

        }).catch(error => {
            return error;
        })
    }

    /**
     * 
     * na podstawie strony bazowej sklepu(media markt/media expert/euro rtv agd) stworzenie listy urządzeń (nazwa + adres URI)
     */
    getNameAndAddresses() {

        return rp(this.domain).then((html) => {
            return DeviceListParser.create(this.market).parse(html, this.baseDomainName);
        }).catch((error) => {
            return error;
        })
    }
}

module.exports = { DeviceListUrlScrapper, DeviceListParser }