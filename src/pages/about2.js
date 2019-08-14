import React from "react"
import { graphql } from 'gatsby'
import Page from '../templates/page'
import Navbar from '../components/navbar'

const About2 = ({ data }) => {
  return (
    <>
      <Navbar />
      <div>
        <Page data={data.allGhostPage.edges[1].node} />
      </div>
    </>
  )
}


export const query = graphql`
query MyQuery2 {
    allGhostPage {
      edges {
        node {
          html
          title
          url
          uuid
        }
      }
    }
  }
`
export default About2