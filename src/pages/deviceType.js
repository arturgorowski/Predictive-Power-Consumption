import React from 'react'
//import { graphql } from "gatsby"
import styles from '../styles/deviceType.module.css'
//import DeviceTypeTemplate from '../templates/deviceType';
import Pagination from '../templates/pagination'

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
                        return <div key={k} className={styles.deviceType}
                            onClick={() => this.onClicked(item, k)}>{item._id.deviceType}({item.count})
                        </div>
                    })
                }
            </div>
        );

        // const details = (
        //     <div className={styles.details}>
        //         {
        //             this.state.clicked ?
        //                 this.state.device.result.map((item, k) => {
        //                     return <DeviceTypeTemplate id={k} device={item} />
        //                 })
        //                 : ''
        //         }
        //     </div>
        // );

        return (
            <>
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