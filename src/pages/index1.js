import React from 'react'
import { Link } from 'gatsby'
import { graphql, StaticQuery } from 'gatsby'
import Autocomplete from '@trevoreyre/autocomplete-js'

const deviceUrl = 'http://localhost:3000/api/devicesPowerInformations/all?search'

class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      deviceType: '',
      productName: '',
      energyClass: '',
      powerConsumption: '',
      powerConsumptionStandby: '',
      annualEnergyConsumption: '',
      noiseLevel: ''
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
          console.log(result.productName)
          this.setState({
            deviceType: result.deviceType,
            productName: result.productName,
            energyClass: result.energyClass,
            powerConsumption: result.powerConsumption,
            powerConsumptionStandby: result.powerConsumptionStandby,
            annualEnergyConsumption: result.annualEnergyConsumption,
            noiseLevel: result.noiseLevel
          })
        }
      }

    })
  }

  passData() {

    console.log("passData", this.state.productName)

  }

  render() {
    let data = this.props.data
    const { deviceType, productName, energyClass, powerConsumption, powerConsumptionStandby, annualEnergyConsumption, noiseLevel } = this.state
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <div
          className='container'
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            //width: '100%',
            minHeight: 1000,
            backgroundImage: `url('https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            paddingBottom: 230
          }}
        >

          <div style={{ color: 'white', fontSize: '4vw', marginBottom: '10px', marginTop: '10px' }}>{data.siteMetadata.description}</div>
          <div style={{ color: 'white', fontSize: '2vw', marginBottom: '15px', marginTop: '15px' }}>Enter the device and discover the magic!</div>

          <div id='autocomplete' className='autocomplete'
            style={{ justifyContent: 'center' }}>
            <input
              className='autocomplete-input'
              style={{ fontSize: '2vw', width: '60%', height: 50, opacity: 0.6, textAlign: 'center', borderRadius: '4px', border: 'none' }}
              type="text"
              name="searchInput"
              placeholder='type here'
              onChange={this.onSubmitText}
            />
            <ul class="autocomplete-result"
              style={{
                margin: 0,
                fontSize: '2vw',
                padding: 0,
                boxSizing: 'border-box',
                maxHeight: '296px',
                overflowY: 'auto',
                backgroundColor: '#fff',
                opacity: 0.8,
                listStyle: 'none',
                boxShadow: '0 2px 2px rgba(0, 0, 0, .16)'
              }}
            ></ul>
          </div>

          <div className='about' style={{ flexDirection: 'column', margin: 0, alignContent: 'center', textAlign: 'center', marginTop: 25, fontSize: '1.5vw' }}>
            <Link style={{ textDecoration: 'none', marginRight: 15, color: 'white' }} to='/about1/'>About1</Link>
            <Link style={{ textDecoration: 'none', color: 'white' }} to='/about2/'>About2</Link>
          </div>

          <div style={{ display: 'flex', marginTop: '30px', flexDirection: 'row' }} className='deviceInformation'>
            <div className="textDeviceInfo"
              style={{ flex:1, fontSize: '2vw', width: '50%', height: 200, opacity: 1, textAlign: 'right', borderRadius: '4px', border: 'none', fontWeight: 'bold' }}
            >
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
            <div className="textDeviceInfo"
              style={{ flex:1, fontSize: '2vw', width: '50%', height: 200, opacity: 1, textAlign: 'left', borderRadius: '4px', border: 'none' }}
            >
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