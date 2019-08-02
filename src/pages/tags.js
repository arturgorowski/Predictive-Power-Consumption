import React from "react"

// Utilities
import kebabCase from "lodash/kebabCase"
// Components
import { Link, graphql } from "gatsby"

const Tags = ({
  data: {
    allGhostPage: {
      edges: {
        node: {
          tags
        }
      }
    }
  }
}) => (
    <div>
      <div>
        <h1>Tags</h1>
        <ul>

          {tags.map(tag => (
            <li key={tag.slug}>
              <Link to={`/tags/${kebabCase(tag.slug)}/`}>
                {tag.name} ({tag.slug})
              </Link>
            </li>
          ))}

        </ul>
      </div>
    </div>
  )

// Tags.propTypes = {
//   data: PropTypes.shape({
//     allGhostPage: PropTypes.shape({
//       edges: PropTypes.arrayOf(
//         PropTypes.shape({
//           node: PropTypes.shape({
//             tags: PropTypes.arrayOf(
//               PropTypes.shape({
//                 name: PropTypes.string.isRequired,
//                 slug: PropTypes.string.isRequired,
//               })
//             ),
//           }),
//         }).isRequired
//       ),
//     }),
//   }),
// }
export default Tags

export const pageQuery = graphql`
query tagsQueryPage{
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