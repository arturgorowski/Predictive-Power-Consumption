import React from "react"
import PropTypes from "prop-types"
import { Link, graphql } from "gatsby"


const Tags = ({ data }) => {

  const { tags } = data.allGhostPage.edges

  return (
    <div>
      <ul>
        {tags.map(({ node }) => {
          const { slug } = node.slug
          const { title } = node.name
          return (
            <li key={slug}>
              <Link to={slug}>{title}</Link>
            </li>
          )
        })}
      </ul>
      {/*
              This links to a page that does not yet exist.
              We'll come back to it!
            */}
      <Link to="/tags">All tags</Link>
    </div>
  )
}
Tags.propTypes = {
  data: PropTypes.shape({
    allGhostPage: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            tags: PropTypes.arrayOf(
              PropTypes.shape({
                name: PropTypes.string.isRequired,
                slug: PropTypes.string.isRequired,
              })
            ),
          }),
        }).isRequired
      ),
    }),
  }),
}
export default Tags

export const pageQuery = graphql`
query tagsQuery{
  allGhostPage {
    edges {
      node {
        id
        url
        tags {
          name
          id
          slug
        }
      }
    }
  }
}
`