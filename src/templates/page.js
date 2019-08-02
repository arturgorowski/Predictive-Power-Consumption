import React from "react"

const Page = ({ passProps, data, location }) => {

  return (
    <>
      <div className="container" style={{ flex: 1, flexDirection: 'row' }}>

        <article style={{ width: '100%', textAlign: 'center' }} className="content">

          <h1 style={{ marginTop: 30 }} className="content-title">{data.title}</h1>

          {/* The main page content */}

          <section
            style={{ marginLeft: 50, marginRight: 50, textAlign: 'center' }}
            className="content-body load-external-scripts"
            dangerouslySetInnerHTML={{ __html: data.html }}
          />

        </article>

      </div>
    </>
  )
}

export default Page