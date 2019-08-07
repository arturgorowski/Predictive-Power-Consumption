import React from 'react'
import styles from '../styles/deviceType.module.css'

const DeviceTypeTemplate = ({ device }) => {

    const { deviceType, productName, energyClass, powerConsumption, powerConsumptionStandby, annualEnergyConsumption, noiseLevel } = device
    return (
        <>
            <div className={styles.container}>

                {deviceType.length > 0 ?
                    <div className={styles.deviceInformation}>
                        <div className={styles.textDeviceInfo}>
                            <ul>
                                <p>Device type:</p>
                                <p>Product name:</p>
                                <p>Energy class:</p>
                                <p>Power consumption:</p>
                                <p>Power consumption standby:</p>
                                <p>Annual energy consumption:</p>
                                <p>Noise level:</p>
                            </ul>

                        </div>
                        <div className={styles.dataDeviceInfo}>
                            <ul>
                                <p>{deviceType}</p>
                                <p>{productName}</p>
                                <p>{energyClass}</p>
                                <p>{powerConsumption}</p>
                                <p>{powerConsumptionStandby}</p>
                                <p>{annualEnergyConsumption}</p>
                                <p>{noiseLevel}</p>
                            </ul>

                        </div>
                    </div>
                    : <div></div>}

            </div>
        </>
    )
}

export default DeviceTypeTemplate