import React from 'react'
//import { graphql } from "gatsby"
import styles from '../styles/deviceType.module.css'
//import DeviceTypeTemplate from '../templates/deviceType';
import Pagination from '../templates/pagination'
import Navbar from '../components/navbar';

const deviceTypeUrl = 'http://localhost:3000/api/devicesPowerInformations/allDeviceType'
const searchDeviceUrl = 'http://localhost:3000/api/devicesPowerInformations/findByDeviceType?search='


class DeviceType extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            device: [],
            fetched: false,
            clicked: false,
        }

        this.onClicked = this.onClicked.bind(this);
    }

    componentDidMount() {
        fetch(deviceTypeUrl)
            .then(response => response.json())
            .then(data => {
                this.setState({ data: data, fetched: true })
            })
            .catch(err => { return err })
    }

    onClicked(device, id) {

        let url = searchDeviceUrl + device._id.deviceType
        let btnContainer = document.getElementsByClassName(styles.categories)[0];
        let btns = btnContainer.getElementsByClassName(styles.deviceType);
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
                //console.log("fetch data", data.result)
                this.setState({ device: data, clicked: true })
            })
            .catch(err => { return err })
    }

    render() {

        const categories = (
            <div className={styles.categories}>
                {
                    this.state.data.map((item, k) => {
                        return <div id={k} key={k} className={styles.deviceType}
                            onClick={() => this.onClicked(item, k)}>{item._id.deviceType} ({item.count})
                        </div>
                    })
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
                        this.state.clicked ? <Pagination device={this.state.device} /> : ''
                    }

                </div>
            </>
        )
    }
}

export default DeviceType

// export const DeviceQuery = graphql`
//   query{
//     allDeviceType {
//       _id {
//           deviceType
//       }
//       count
//     }
//   }
// `