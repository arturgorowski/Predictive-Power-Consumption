/**
 * 
 * Ujednolicenie jednostek elektrycznych urządzeń parsowanych z media marktu etc...
 */
class UnificationOfUnits {

    constructor(devices) {
        this.devices = devices;
    }


    // TODO :
    // sparsowana tablica => detekcja urzadzenia => detekcja jednostki energii => zwrócenie jednostki w kWh


    getDeviceType(devices){
        devices.forEach(element => {
            
        });
    }

    getUnitEnergy(){

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

module.exports = { UnificationOfUnits }