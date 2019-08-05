import React from 'react'
import { Link } from 'gatsby'
import styles from '../styles/deviceType.module.css'

const deviceTypeUrl = 'http://localhost:3000/api/devicesPowerInformations/findByDeviceType?search='

class DeviceTypeTemplate extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: []
        }
    }

    onClickDevice(){
        console.log("click", this.props.deviceType.device)
    }



    render() {
        const device = this.props
        console.log(device)
        const { data } = this.state
        return (
            <>
                <div className={styles.container}>
                    {device.device}
                </div>
            </>
        )
    }
}

export default DeviceTypeTemplate