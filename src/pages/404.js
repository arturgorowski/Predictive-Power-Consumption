import React from "react"
import Layout from "../components/layout"
import Navbar from '../components/navbar'

const NotFoundPage = () => (
  <>
    <Navbar />
    <Layout>
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  </>
)

export default NotFoundPage
