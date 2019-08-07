import React from "react"
import styles from '../styles/page.module.css'

const Page = ({ data }) => {

  return (
    <>
      <div className={styles.container}>

        <article className={styles.content}>

          <h1 className={styles.contentTitle}>{data.title}</h1>

          <section
            className={`${styles.contentBody} load-external-scripts`}
            dangerouslySetInnerHTML={{ __html: data.html }}
          />

        </article>

      </div>
    </>
  )
}

export default Page