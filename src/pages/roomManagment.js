import React from 'react';
import styles from '../styles/roomManagment.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from '../components/navbar';
import Modal from '../components/modal';


class RoomManagment extends React.Component {

    constructor(props) {
        super(props)

        this.saveModalDevices = this.saveModalDevices.bind(this);

        this.state = {
            requiredItem: 0,
            rooms: [
                {
                    room: "Hall",
                    devices: []
                },
                {
                    room: "Kitchen",
                    devices: []
                },
                {
                    room: "Bathroom",
                    devices: []
                },
                {
                    room: "Bedroom",
                    devices: []
                },
                {
                    room: "Living Room",
                    devices: []
                },
            ],
            powerConsumption: 0,
            annualEnergyConsumption: 0
        }
    }

    chooseModalItem(index) {
        this.setState({
            requiredItem: index
        });
    }

    saveModalDevices(item) {
        const requiredItem = this.state.requiredItem;
        let tempRooms = this.state.rooms;
        console.log(item)
        tempRooms[requiredItem].devices = item;
        this.setState({ rooms: tempRooms });
    }

    energyConsumption() {

        this.setState({ powerConsumption: 0, annualEnergyConsumption: 0 }, () => {
            let powerConsumption = 0, annualEnergyConsumption = 0
            this.state.rooms.forEach((room) => {

                room.devices.forEach((device) => {

                    if (device.powerConsumption !== "no data") {
                        powerConsumption = powerConsumption + Number(device.powerConsumption)
                        this.setState({ powerConsumption: powerConsumption })
                    }

                    if (device.annualEnergyConsumption !== "no data") {
                        annualEnergyConsumption = annualEnergyConsumption + Number(device.annualEnergyConsumption)
                        this.setState({ annualEnergyConsumption: annualEnergyConsumption })
                    }

                })

            })

        })

    }

    render() {

        const rooms = this.state.rooms.map((item, index) => {
            return (
                <div className={styles.room} key={index} data-toggle="modal" data-target="#exampleModal" onClick={() => this.chooseModalItem(index)}>
                    <p className={styles.roomName}>{item.room}</p>

                    <div className={styles.door}></div>
                </div>
            )
        });

        const deviceDetails = this.state.rooms.map((room, index) => {
            return (
                <>
                    ===============
                    <p>{room.room}</p>
                    {room.devices.map((device) => {
                        return (
                            <>
                                <h5>{device.productName}</h5>
                                <p>pc {device.powerConsumption}</p>
                                <p>aec {device.annualEnergyConsumption}</p>
                            </>
                        )
                    })}
                </>
            )
        })

        const requiredItem = this.state.requiredItem;
        let modalData = this.state.rooms[requiredItem];
        return (
            <>
                <Navbar />
                <div className={styles.container}>

                    <div className={styles.plan}>
                        <div className={styles.start}></div>
                        {rooms}
                    </div>

                    <div className={styles.deviceDetailsContainer}>
                        {deviceDetails}
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => this.energyConsumption()}
                        >calculate energy consumption</button>

                        <p style={{ width: 'max-content' }}>power consumption: {this.state.powerConsumption} [kWh]</p>
                        <p style={{ width: 'max-content' }}>annual energy consumption: {this.state.annualEnergyConsumption} [kWh/year]</p>
                    </div>

                </div>

                <Modal
                    room={modalData.room}
                    devices={modalData.devices}
                    saveModalDevices={this.saveModalDevices}
                />
            </>
        )

    }
}

export default RoomManagment