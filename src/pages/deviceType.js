import React from 'react'
import { Link } from 'gatsby'
import styles from '../styles/deviceType.module.css'
import Devices from './devices';
import DeviceTypeTemplate from '../templates/deviceType';

const deviceTypeUrl = 'http://localhost:3000/api/devicesPowerInformations/allDeviceType'

class DeviceType extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        fetch(deviceTypeUrl)
            .then(response => response.json())
            .then(data => {
                this.setState({ data: data })
            })
    }

    render() {
        const { data } = this.state
        return (
            <>
                <div className={styles.container}>
                    {data.length > 0 ?
                        data.map((item) => {
                            return <div><DeviceTypeTemplate device={item._id.deviceType}/></div>
                        })
                        : <div></div>
                    }
                </div>
            </>
        )
    }
}

export default DeviceType