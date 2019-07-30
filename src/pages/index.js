import React from "react"
import { Link } from "gatsby"
import { graphql } from 'gatsby'
//import 'bootstrap/dist/css/bootstrap.css';
//import '@fortawesome/fontawesome-free'

const HomePage = ({ data }) => {
  return (
    <div
      className='container'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        height: 1000,
        backgroundImage: `url('https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        paddingBottom: 200
      }}
    >

      <div className='text' style={{ color: 'white' }}>

        <h1>{data.site.siteMetadata.description}</h1>
        <h3>Enter the device and discover the magic!</h3>

      </div>

      <div className='input'>

        <input
          style={{ fontSize: 30, width: '60%', height: 50, opacity: 0.6, textAlign: 'center', borderRadius: '4px', border: 'none' }} 
          type="text" 
          name="searchInput"
          placeholder='type here'
        />

      </div>

      <div className='about' style={{ flexDirection: 'column', margin: 0, alignContent: 'center', textAlign: 'center', marginTop: 25, fontSize: 22 }}>

        <Link style={{ textDecoration: 'none', marginRight: 15, color: 'white' }} to='/about2/'>About1</Link>
        <Link style={{ textDecoration: 'none', color: 'white' }} to='/about1/'>About2</Link>

      </div>

      <div className='deviceInformation'></div>

    </div>
  )
}

export const query = graphql`
  query HomePageQuery {
        site {
      siteMetadata {
        description
      }
      }
    }
  `

export default HomePage