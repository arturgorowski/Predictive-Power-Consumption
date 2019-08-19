import React from 'react';
import styles from '../styles/index.module.css';
import 'bootstrap/dist/css/bootstrap.css';

class Navbar extends React.Component {

    constructor(props) {
        super(props)

    }


    render() {

        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

                <a className="navbar-brand" href="/">Predictive Power Consumption</a>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div style={{ justifyContent: 'flex-end' }} className="collapse navbar-collapse" id="navbarNavDropdown">

                    <ul className="navbar-nav">

                        <li className="nav-item">
                            <a className="nav-link" href="/home">Home</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/deviceType">Device Type</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/producent">Producent</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/roomManagment">Room Managment</a>
                        </li>

                    </ul>

                </div>

            </nav>
        )
    }
}

export default Navbar