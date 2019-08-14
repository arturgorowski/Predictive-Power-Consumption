import React from 'react';
import styles from '../styles/index.module.css';
import 'bootstrap/dist/css/bootstrap.css';

class Navbar extends React.Component {

    constructor(props) {
        super(props)

    }


    render() {

        return (
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">

                <a class="navbar-brand" href="/">Predictive Power Consumption</a>

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div style={{ justifyContent: 'flex-end' }} class="collapse navbar-collapse" id="navbarNavDropdown">

                    <ul class="navbar-nav">

                        <li class="nav-item">
                            <a class="nav-link" href="/home">Home</a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="/deviceType">Device Type</a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="/producent">Producent</a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="/roomManagment">Room Managment</a>
                        </li>

                    </ul>

                </div>

            </nav>
        )
    }
}

export default Navbar