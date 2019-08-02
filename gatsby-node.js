const path = require("path")
const _ = require("lodash")

exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions


  const { result } = await graphql(`
    {
      allGhostPost(sort: { order: ASC, fields: published_at }) {
        edges {
          node {
            slug
          }
        }
      }

      allGhostPage(sort: { order: ASC, fields: published_at }) {
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
  `)

  // Check for any errors
  if (result.errors) {
    throw new Error(errors.result)
  }

  // Extract query results
  const pages = result.data.allGhostPage.edges
  const pages1 = result.data.allGhostPage.edges
  const posts = result.data.allGhostPost.edges

  // Load templates
  const pageTemplate = path.resolve(`./src/templates/page.js`)
  const postTemplate = path.resolve(`./src/templates/post.js`)
  const tagTemplate = path.resolve("src/templates/tags.js")

  // Create pages
  pages.forEach(({ node }) => {
    // This part here defines, that our pages will use
    // a `/:slug/` permalink.
    node.url = `/${node.slug}/`

    createPage({
      path: node.url,
      component: pageTemplate,
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.slug,
      },
    })
  })

  // Create post pages
  posts.forEach(({ node }) => {
    // This part here defines, that our posts will use
    // a `/:slug/` permalink.
    node.url = `/${node.slug}/`

    createPage({
      path: node.url,
      component: postTemplate,
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.slug,
      },
    })
  })

  // // Create post detail pages
  // pages1.forEach(({ node }) => {
  //   createPage({
  //     path: node.url,
  //     component: pageTemplate,
  //   })
  // })
  // // Tag pages:
  // let tags = []
  // // Iterate through each post, putting all found tags into `tags`
  // _.each(pages1, edge => {
  //   if (_.get(edge, "node.tags")) {
  //     tags = tags.concat(edge.node.tags)
  //   }
  // })
  // // Eliminate duplicate tags
  // tags = _.uniq(tags)
  // // Make tag pages
  // tags.forEach(tag => {
  //   createPage({
  //     path: `/tags/${_.kebabCase(tag)}/`,
  //     component: tagTemplate,
  //     context: {
  //       tag,
  //     },
  //   })
  // }
  //)
}