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
            if (room.devices.length > 0) {
                console.log(room.devices.length, room, index)
                //if(room[])
                return (
                    <>
                        <div class="carousel-item">
                            <h5 class="card-title">{room.room}</h5>
                            {
                                room.devices.map((device) => {
                                    return (

                                        <div class="card">

                                            <div class="card-body">
                                                <h5 class="card-title">{device.productName}</h5>
                                                <p class="card-text">Power consumption: {device.powerConsumption}</p>
                                                <p class="card-text">Annual energy consumption: {device.annualEnergyConsumption}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>
                )
            }

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
                </div>

                <div className={styles.deviceDetailsContainer}>

                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.energyConsumption()}
                    >calculate energy consumption</button>

                    <p className={styles.p}>power consumption: {this.state.powerConsumption} [kWh]</p>
                    <p className={styles.p}>annual energy consumption: {this.state.annualEnergyConsumption} [kWh/year]</p>


                </div>

                <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">

                        <div class="card">
                            <div class="card-body">

                                <div class="carousel-item active">
                                    <h5 class="card-title">Choosen device</h5>

                                    <div class="card">

                                        <div class="card-body">
                                            <h5 class="card-title">Product Name</h5>
                                            <p class="card-text">Power consumption</p>
                                            <p class="card-text">Annual energy consumption</p>
                                        </div>

                                    </div>

                                </div>

                                {deviceDetails}
                            </div>
                        </div>

                    </div>
                    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
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