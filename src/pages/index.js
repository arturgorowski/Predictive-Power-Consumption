import React from 'react'
import { Link } from 'gatsby'
import { graphql, StaticQuery } from 'gatsby'
import Autocomplete from '@trevoreyre/autocomplete-js'
import styles from '../styles/index.module.css'
import DeviceType from './deviceType'

const deviceUrl = 'http://localhost:3000/api/devicesPowerInformations/all?search'

class HomePage extends React.Component {

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
      producent: ''
    }
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
          if (result.deviceType === 'fridge') {
            if (result.powerConsumption === 'no data' && result.annualEnergyConsumption === 'no data') {
              this.setState({
                productName: result.productName,
                producent: result.producent,
                energyClass: result.energyClass,
                powerConsumption: result.powerConsumption,
                powerConsumptionStandby: result.powerConsumptionStandby,
                annualEnergyConsumption: result.annualEnergyConsumption,
                noiseLevel: result.noiseLevel,
                deviceType: result.deviceType
              })

            }
            if (result.powerConsumption === 'no data' && result.annualEnergyConsumption !== 'no data') {
              let annualEnergyConsumptionTemp = (result.annualEnergyConsumption.split(" ", 1)[0]) / 366
              let annualEnergyTemp = result.annualEnergyConsumption.split(" ", 1)[0] + ' kWh'
              //console.log(annualEnergyTemp)
              annualEnergyConsumptionTemp = Math.round(annualEnergyConsumptionTemp * 100) / 100
              annualEnergyConsumptionTemp = annualEnergyConsumptionTemp + ' kWh'
              this.setState({
                productName: result.productName,
                producent: result.producent,
                energyClass: result.energyClass,
                powerConsumption: annualEnergyConsumptionTemp,
                powerConsumptionStandby: result.powerConsumptionStandby,
                annualEnergyConsumption: annualEnergyTemp,
                noiseLevel: result.noiseLevel,
                deviceType: result.deviceType
              })

            } else {
              this.setState({
                productName: result.productName,
                producent: result.producent,
                energyClass: result.energyClass,
                powerConsumption: result.powerConsumption,
                powerConsumptionStandby: result.powerConsumptionStandby,
                annualEnergyConsumption: result.annualEnergyConsumption,
                noiseLevel: result.noiseLevel,
                deviceType: result.deviceType
              })
            }
          } else {
            let annualEnergyTemp
            result.annualEnergyConsumption === 'no data' ? annualEnergyTemp = 'no data' : annualEnergyTemp = result.annualEnergyConsumption.split(" ", 1)[0] + ' kWh'
            this.setState({
              productName: result.productName,
              producent: result.producent,
              energyClass: result.energyClass,
              powerConsumption: result.powerConsumption,
              powerConsumptionStandby: result.powerConsumptionStandby,
              annualEnergyConsumption: annualEnergyTemp,
              noiseLevel: result.noiseLevel,
              deviceType: result.deviceType
            })
          }
          // this.setState({
          //   deviceType: result.deviceType,
          //   productName: result.productName,
          //   energyClass: result.energyClass,
          //   powerConsumption: result.powerConsumption,
          //   powerConsumptionStandby: result.powerConsumptionStandby,
          //   annualEnergyConsumption: result.annualEnergyConsumption,
          //   noiseLevel: result.noiseLevel,
          //   producent: result.producent
          // })
        }
      }
    })
  }

  render() {
    let data = this.props.data
    const { deviceType, productName, energyClass, powerConsumption, powerConsumptionStandby, annualEnergyConsumption, noiseLevel, producent } = this.state
    return (
      <>
        <div className={styles.container} >

          <div className={styles.description}>{data.siteMetadata.description}</div>
          <div className={styles.title}>Type the device and discover the magic!</div>

          <div id='autocomplete' className={styles.autocomplete}>
            <input
              className={styles.autocompleteInput}
              type="text"
              name="searchInput"
              placeholder='type here'
              onChange={this.onSubmitText}
            />
            <ul className={styles.autocompleteResult}></ul>
          </div>

          <div className={styles.about}>
            <Link className={styles.aboutPage} style={{ marginRight: 20 }} to='/about1/'>About1</Link>
            <Link className={styles.aboutPage} to='/about2/'>About2</Link>
          </div>

          {
            deviceType.length > 0 ?
              <div className={styles.deviceInformation}>
                <div className={styles.textDeviceInfo}>
                  <ul>
                    <p>Device type:</p>
                    <p>Product name:</p>
                    <p>Producent:</p>
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
                    <p>{producent}</p>
                    <p>{energyClass}</p>
                    <p>{powerConsumption}</p>
                    <p>{powerConsumptionStandby}</p>
                    <p>{annualEnergyConsumption}</p>
                    <p>{noiseLevel}</p>
                  </ul>

                </div>
              </div>
              : <div></div>
          }


        </div>
        <DeviceType style={styles.deviceType} />
      </>
    )
  }
}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            description
          }
        }
      }
    `}
    render={(data) => (
      <HomePage data={data.site} />
    )}
  />
)