import React, { Component } from 'react';
import styles from '../styles/autocomplete.module.css';
import Autocomplete from '@trevoreyre/autocomplete-js';

const deviceUrl = 'http://localhost:3000/api/devicesPowerInformations/all?search';

class Modal extends Component {
    constructor(props) {
        super(props);

        this.handleSave = this.handleSave.bind(this);

        this.state = {
            room: '',

            deviceType: '',
            productName: '',
            energyClass: '',
            powerConsumption: '',
            powerConsumptionStandby: '',
            annualEnergyConsumption: '',
            noiseLevel: '',
            producent: '',

            devices: []
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            room: nextProps.room,
            devices: nextProps.devices
        });
    }

    handleSave() {
        const item = this.state.devices;
        console.log("save >>", item)
        this.props.saveModalDevices(item)
    }

    addDevice() {

        let newElement = {
            deviceType: this.state.deviceType,
            productName: this.state.productName,
            energyClass: this.state.energyClass,
            powerConsumption: this.state.powerConsumption,
            powerConsumptionStandby: this.state.powerConsumptionStandby,
            annualEnergyConsumption: this.state.annualEnergyConsumption,
            noiseLevel: this.state.noiseLevel,
            producent: this.state.producent
        }

        let tempDevices = this.state.devices;
        tempDevices.push(newElement);
        this.setState({ devices: tempDevices });
    }

    deleteDevice(index) {
        let tempDevice = this.state.devices;
        tempDevice.splice(index, 1);
        this.setState({ devices: tempDevice });
    }

    onSubmitText = () => {

        new Autocomplete('#autocomplete', {

            // Search function can return a promise
            // which resolves with an array of 
            // results.
            search: input => {

                const url = `${deviceUrl}=${encodeURI(input)}`
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
                    })
                }
            }
        })
    }

    render() {

        const devices = this.state.devices.length > 0 ?
            <p>{this.state.devices.map((item, index) => {
                return (
                    <>
                        <div className={styles.devicesList}>
                            <li>{item.productName}</li>
                            <button type="button" className="btn btn-danger" onClick={() => this.deleteDevice(index)}>Remove</button>
                        </div>

                    </>
                )
            })}</p>
            : ''

        return (
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Device</h5>
                        </div>
                        <div className="modal-body">
                            <p><span className="modal-lable">{this.state.room}</span></p>

                            <div id='autocomplete' className={styles.autocomplete}>
                                <input
                                    id='autocompletes'
                                    className={styles.autocompleteInput}
                                    type="text"
                                    name="searchInput"
                                    placeholder='add device here'
                                    onChange={this.onSubmitText}
                                />
                                <button type="button" className="btn btn-primary" onClick={() => this.addDevice()}>Add</button>
                                <ul className={styles.autocompleteResult}></ul>

                            </div>

                            {devices}

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => { this.handleSave() }}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;