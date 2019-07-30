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
            slug
            url
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
  const posts = result.data.allGhostPost.edges

  // Load templates
  const pageTemplate = path.resolve(`./src/templates/page.js`)
  const postTemplate = path.resolve(`./src/templates/post.js`)

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


}

