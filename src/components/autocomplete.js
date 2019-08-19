import React from 'react';
import Autocomplete from '@trevoreyre/autocomplete-js';
import styles from '../styles/autocomplete.module.css';
const deviceUrl = 'http://localhost:3000/api/devicesPowerInformations/all?search';


class AutocompleteInput extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            deviceType: '',
            productName: '',
            energyClass: '',
            powerConsumption: '',
            powerConsumptionStandby: '',
            annualEnergyConsumption: '',
            noiseLevel: '',
            producent: '',
            time: 1,
            devices: []
        }

    }

    passDataToParent() {
        // const { deviceType, productName, energyClass, powerConsumption, powerConsumptionStandby, annualEnergyConsumption, noiseLevel, producent } = this.state
        // this.setState({
        //     devices: { deviceType, productName, energyClass, powerConsumption, powerConsumptionStandby, annualEnergyConsumption, noiseLevel, producent }
        // })

        this.setState(state => {
            const devices = state.devices.concat(state.value);

            return {
                devices
            };
        });

        console.log("devices>>>", this.state.devices)
    }

    onSubmitText = (time) => {

        new Autocomplete('#autocomplete', {

            // Search function can return a promise
            // which resolves with an array of 
            // results.
            search: input => {

                let url
                this.state.time > 1 ? url = `${deviceUrl}=${encodeURI(input)}&time=${this.state.time}` : url = `${deviceUrl}=${encodeURI(input)}`
                //const url = `${deviceUrl}=${encodeURI(input)}`
                console.log(url)

                return new Promise(resolve => {
                    if (input.length < 3) {
                        return resolve([])
                    }

                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            resolve(data.result)
                        })
                })
            },
            getResultValue: result => result.productName,
            autoSelect: true,

            onSubmit: result => {
                if (result !== undefined) {
                    //console.log(result)

                    this.setState({
                        deviceType: result.deviceType,
                        productName: result.productName,
                        energyClass: result.energyClass,
                        powerConsumption: result.powerConsumption,
                        powerConsumptionStandby: result.powerConsumptionStandby,
                        annualEnergyConsumption: result.annualEnergyConsumption,
                        noiseLevel: result.noiseLevel,
                        producent: result.producent
                    }, () => { })

                    this.setState(state => {
                        const devices = state.devices.concat(state.value);

                        return {
                            devices
                        };
                    });

                }
            }
        })
    }

    render() {

        return (
            <>
                <div id='autocomplete' className={styles.autocomplete}>
                    <input
                        id='autocompletes'
                        className={styles.autocompleteInput}
                        type="text"
                        name="searchInput"
                        placeholder='add device here'
                        onChange={this.onSubmitText}
                    />
                    {/* <button type="button" className="btn btn-primary" onClick={() => this.passDataToParent()}>Add</button> */}
                    <ul className={styles.autocompleteResult}></ul>

                </div>
            </>
        )
    }

}


export default AutocompleteInput