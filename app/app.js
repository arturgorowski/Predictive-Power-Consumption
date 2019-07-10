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

        // let mediaMarktPopped = tvNameAndAddress.pop();
        // let mediaExpertPopped = tvNameAndAddress.pop();
        // let euroRtvAgdPopped = tvNameAndAddress.pop();
        // let trash = tvNameAndAddress.pop();

        // for (let i = 0; i < mediaExpertPopped.length; i++) {
        //     if (mediaMarktPopped[i] !== undefined) tvNameAndAddress.push(mediaMarktPopped[i]);
        //     if (mediaExpertPopped[i] !== undefined) tvNameAndAddress.push(mediaExpertPopped[i]);
        //     if (euroRtvAgdPopped[i] !== undefined) tvNameAndAddress.push(euroRtvAgdPopped[i]);
        // }

        tvNameAndAddress.forEach((address) => {
            addresses.push(address.address)
        })
        //console.log("addresses:", addresses)
        let promises = addresses.map(url => {
            //console.log(">>> url", url)
            return rp(url).then((response) => {
                return response
            }).catch((error) => {
                return error
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

const listScrapper = new DeviceListParser();

/**
 * 
 * Utworzenie tablicy z adresami URL i nazwami urządzeń 
 */
class DeviceListUrlScrapper {

    constructor(domain) {
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
            //return allUrlData.push(response), console.log('tab of all uri', allUrlData);
            return listScrapper.getScrapperList(allUrlData.push(response));
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
            return DeviceListParser.create(this.market).parse(html);
        }).catch((error) => {
            return error;
        })
    }
}

module.exports = { DeviceListUrlScrapper, DeviceListParser }