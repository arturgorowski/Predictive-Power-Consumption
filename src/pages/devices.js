import React from 'react'
import { Link } from 'gatsby'
import styles from '../styles/deviceType.module.css'
import DeviceTypeTemplate from '../templates/deviceType';

const deviceTypeUrl = 'http://localhost:3000/api/devicesPowerInformations/findByDeviceType?search='

class Devices extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: []
        }
    }

    render() {
        const device = this.props.device
        console.log("props devices", device)

        return (
            <>
                <div className={styles.container}>
                    <DeviceTypeTemplate device={device}/>
                </div>
            </>
        )
    }
}

export default Devices