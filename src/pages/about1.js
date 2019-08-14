import React from "react"
import { graphql } from 'gatsby'
import Page from '../templates/page'
import Navbar from '../components/navbar'

const About1 = ({ data }) => {
  return (
    <>
      <Navbar />
      <div>
        <Page data={data.allGhostPage.edges[2].node} />
      </div>
    </>
  )
}

export const query = graphql`
query MyQuery {
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
export default About1