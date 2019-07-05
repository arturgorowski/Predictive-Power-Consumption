let rp = require('request-promise');

class DeviceListParser {

    constructor() {
        console.log("HELLO FROM :: DeviceListParser")

    }

}

DeviceListParser.create = (market) => {

    switch (market) {

        case "mediamarkt":
            return new DeviceListMMParser();
            break;

        case "mediaexpert":
            return new DeviceListMEParser();
            break;

        case "eurortvagd":
            return new DeviceListERAParser();
            break;

    }
}

class DeviceListMMParser extends DeviceListParser {

    constructor() {
        super();
        console.log(`HELLO FROM :: ${this.constructor}`);

    }

    parse(html) {

        //@todo ...
        console.log(`HELLO FROM :: ${this.constructor.name}`, html);
    }

}

class DeviceListMEParser extends DeviceListParser {

    constructor() {
        super();
        console.log(`HELLO FROM :: constructor ${this.constructor.name}`);
    }

    parse(html) {

        //@todo ...
        console.log(`HELLO FROM :: parse ${this.constructor.name} >>> `, html);
    }

}

class DeviceListERAParser extends DeviceListParser {

    constructor() {
        super();
        console.log(`HELLO FROM :: ${this.constructor}`);

    }

    parse(html) {

        //@todo ...
        console.log(`HELLO FROM :: ${this.constructor.name}`, html);
    }

}

/**
 * 
 * Utworzenie tablicy z adresami 
 * 
 * 
 */
class DeviceListUrlScrapper {
    constructor(domain) {
        this.domain = domain;
        // this.pageNumber = pageNumber;

        // this.url = domain + pageNumber;

        // is mediamarkt, mediaexpert
        this.market = this.getMarketName();

    }

    getMarketName() {

        //@todo detekcja sklepu na podstawie domeny
        switch (this.domain) {

            case 'https://mediamarkt.pl':
                console.log('media markt here')
                return 'mediamarkt';
                break;

            case 'https://www.mediaexpert.pl':
                console.log('media expert here')
                return 'mediaexpert';
                break;

            case 'https://www.euro.com.pl':
                console.log('euro rtv agd here')
                return 'eurortvagd';
                break;
        }

    }

    getNameAndAddresses() {
        rp(this.domain)
            .then((html) => {
                return DeviceListParser.create(this.market).parse(html);
            })
            .catch((error) => {
                throw error;
            });
    }
}

//DeviceListParser.create("mediaexpert").parse("gajsdfh ksadfkjahskdfhaksjdf");
const mm = 'https://mediamarkt.pl'

const dp = new DeviceListUrlScrapper(mm);

dp.getNameAndAddresses().then(result => {
    console.log(">>> ", result);
})

module.exports = { DeviceListUrlScrapper }