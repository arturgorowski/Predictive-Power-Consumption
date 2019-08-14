import React from 'react';
import styles from '../styles/producent.module.css';
import Navbar from '../components/navbar';

const producentUrl = 'http://localhost:3000/api/devicesPowerInformations/allProducent'
const searchProducentUrl = 'http://localhost:3000/api/devicesPowerInformations/findByProducent?search='


class Producent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            producentCategory: [],
            producent: [],
            producentDetails: [],
            fetched: false,
            clicked: false,
            clickedProductName: false
        }

        this.onClicked = this.onClicked.bind(this);
        //this.onClickedProductName = this.onClickedProductName.bind(this);
    }

    componentDidMount() {
        fetch(producentUrl)
            .then(response => response.json())
            .then(producent => {
                this.setState({ producentCategory: producent, fetched: true })
            })
            .catch(err => { return err })
    }

    onClicked(producent, id) {

        let url = searchProducentUrl + producent._id.producent
        let btnContainer = document.getElementsByClassName(styles.categories)[0];
        let btns = btnContainer.getElementsByClassName(styles.producent);

        // Loop through the buttons and add the active class to the current/clicked button
        for (let i = 0; i < btns.length; i++) {

            btns[i].addEventListener("click", function () {

                let current = document.getElementsByClassName(`${styles.active}`);
                console.log("cur", current)

                if (current.length > 0) {
                    current[0].className = current[0].className.replace(`${styles.active}`, "");
                }

                this.className += ' ' + styles.active;

            });

        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("fetched data", data.result)
                this.setState({ producent: data, clicked: true, clickedProductName: false }, () => { })
            })
            .catch(err => { return err })
    }

    onClickedProductName = (productName, id) => {

        this.setState({ producentDetails: productName, clickedProductName: true })
        console.log("prodName", productName)

    }

    render() {

        const categories = (
            <div className={styles.categories}>
                {
                    this.state.producentCategory.map((item, k) => {
                        return <div id={k} key={k} className={styles.producent}
                            onClick={() => this.onClicked(item, k)}>{item._id.producent} ({item.count})
                        </div>
                    })
                }
            </div>
        );

        const productName = (
            <div className={styles.productName}>
                {
                    this.state.clicked ?
                        this.state.producent.result.map((item, k) => {
                            //console.log(item, k)
                            return <div id={k} key={k} className={styles.productNameList}
                                onClick={() => this.onClickedProductName(item, k)}>{item.productName}
                            </div>
                        })
                        : ''
                }
            </div>
        );

        const details = (
            <div className={styles.productNameDetails}>
                {
                    this.state.clickedProductName ?

                        <div className={styles.dataDeviceInfo}>

                            <table>
                                <tr>
                                    <td><p>Product name:</p></td>
                                    <td><p>{this.state.producentDetails.productName}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Device type:</p></td>
                                    <td><p>{this.state.producentDetails.deviceType}</p></td>
                                </tr>

                                <tr>
                                    <td><p>Producent:</p></td>
                                    <td><p>{this.state.producentDetails.producent}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Energy class:</p></td>
                                    <td><p>{this.state.producentDetails.energyClass}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Power consumption [kWh]:</p></td>
                                    <td><p>{this.state.producentDetails.powerConsumption}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Power consumption standby [kWh]:</p></td>
                                    <td><p>{this.state.producentDetails.powerConsumptionStandby}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Annual energy consumption [kWh]:</p></td>
                                    <td><p>{this.state.producentDetails.annualEnergyConsumption}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Noise level [dB]:</p></td>
                                    <td><p>{this.state.producentDetails.noiseLevel}</p></td>
                                </tr>
                            </table>

                        </div>

                        : ''
                }
            </div>
        );


        return (
            <>
                <Navbar />
                <div className={styles.deviceContainer}>
                    {
                        this.state.fetched ? categories : ''
                    }
                    {
                        this.state.clicked ? productName : ''
                    }
                    {
                        this.state.clickedProductName ? details : ''
                    }
                </div>
            </>
        )
    }
}

export default Producent