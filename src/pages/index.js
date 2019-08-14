import React from 'react';
import styles from '../styles/index.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from '../components/navbar';

class Index extends React.Component {

  constructor(props) {
    super(props)

  }


  render() {

    return (
      <>
        <Navbar />
        <div className={styles.container}>

        </div>


      </>
    )
  }
}

export default Index