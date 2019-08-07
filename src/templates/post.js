import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
const Post = ({ data }) => {
  const post = data.ghostPost
  return (
    <>
      <article className="post">
        {post.feature_image ? (
          <img src={post.feature_image} alt={post.title} />
        ) : null}
        <h1>{post.title}</h1>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </>
  )
}

Post.propTypes = {
  data: PropTypes.shape({
    ghostPost: PropTypes.shape({
      title: PropTypes.string.isRequired,
      html: PropTypes.string.isRequired,
      feature_image: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
}

export default Post
export const postQuery = graphql`
  query($slug: String!) {
    ghostPost(slug: { eq: $slug }) {
      id
      title
      slug
      feature_image
    }
  }
`