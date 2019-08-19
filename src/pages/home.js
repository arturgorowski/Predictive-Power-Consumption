import React from 'react';
import { Link } from 'gatsby';
import { graphql, StaticQuery } from 'gatsby';
import Autocomplete from '@trevoreyre/autocomplete-js';
import styles from '../styles/home.module.css';
import Navbar from '../components/navbar';
// import AutocompleteInput from '../components/autocomplete';

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
      producent: '',
      time: 1
    }

  }

  onSubmitTime = () => {
    console.log(event.target.value)
    //this.setState({ time: event.target.value })
    this.setState({ time: event.target.value }, () => {
      console.log(this.state);
    });


    let evt = document.createEvent("HTMLEvents");
    evt.initEvent('change', false, true);
    let elem = document.getElementById('times');

    elem.addEventListener('change', event => this.onSubmitText(event.target.value));

    elem.dispatchEvent(evt)

  }

  onSubmitText = (time) => {
    console.log(time)


    new Autocomplete('#autocomplete', {

      // Search function can return a promise
      // which resolves with an array of 
      // results.
      search: input => {

        console.log('time', this.state.time)

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

        }
      }
    })
  }

  render() {
    let data = this.props.data
    const { deviceType, productName, energyClass, powerConsumption, powerConsumptionStandby, annualEnergyConsumption, noiseLevel, producent } = this.state
    return (
      <>
        <Navbar />
        <div className={styles.container} >

          <div className={styles.title}>Type the device and discover the magic!</div>

          <div id='autocomplete' className={styles.autocomplete}>
            <input
              id='autocompletes'
              className={styles.autocompleteInput}
              type="text"
              name="searchInput"
              placeholder='type here'
              onChange={this.onSubmitText}
            />
            <ul className={styles.autocompleteResult}></ul>

          </div>

          <div id='time' className={styles.autocomplete}>
            <input
              id='times'
              className={styles.timeInput}
              type="number"
              name="timeInput"
              placeholder='per hour...'
              onChange={this.onSubmitTime}
            />
          </div>


          <div className={styles.about}>
            <Link className={styles.aboutPage} style={{ marginRight: 20 }} to='/about1/'>About1</Link>
            <Link className={styles.aboutPage} to='/about2/'>About2</Link>
          </div>

          {
            deviceType.length > 0 ?
              <div className={styles.deviceInformation}>
                <table className="table table-dark">
                  <tbody>
                    <tr>
                      <td><p>Product name:</p></td>
                      <td><p>{productName}</p></td>
                    </tr>
                    <tr>
                      <td><p>Device type:</p></td>
                      <td><p>{deviceType}</p></td>
                    </tr>

                    <tr>
                      <td><p>Producent:</p></td>
                      <td><p>{producent}</p></td>
                    </tr>
                    <tr>
                      <td><p>Energy class:</p></td>
                      <td><p>{energyClass}</p></td>
                    </tr>
                    <tr>
                      <td><p>Power consumption [kWh]:</p></td>
                      <td><p>{powerConsumption}</p></td>
                    </tr>
                    <tr>
                      <td><p>Power consumption standby [kWh]:</p></td>
                      <td><p>{powerConsumptionStandby}</p></td>
                    </tr>
                    <tr>
                      <td><p>Annual energy consumption [kWh]:</p></td>
                      <td><p>{annualEnergyConsumption}</p></td>
                    </tr>
                    <tr>
                      <td><p>Noise level [dB]:</p></td>
                      <td><p>{noiseLevel}</p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              : <div></div>
          }


        </div>
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