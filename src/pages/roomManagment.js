import React from 'react';
import styles from '../styles/roomManagment.module.css';
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
                <div className={styles.plan}>

                    <div className={styles.start}></div>

                    <div className={styles.room}>
                        <p className={styles.roomName}>Home</p>

                        <div className={styles.door}></div>
                    </div>

                    <div className={styles.room}>
                        <p className={styles.roomName}>Kitchen</p>

                        <div className={styles.door}></div>
                    </div>

                    <div className={styles.room}>
                        <p className={styles.roomName}>Bathroom</p>

                        <div className={styles.door}></div>
                    </div>

                    <div className={styles.room}>
                        <p className={styles.roomName}>Bedroom</p>

                        <div className={styles.door}></div>
                    </div>

                    <div className={styles.room}>
                        <p className={styles.roomName}>Living Room</p>

                        <div className={styles.door}></div>
                    </div>
                </div>

            </>
        )
    }
}

export default Index