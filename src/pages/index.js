import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../layouts';
import SEO from '../components/seo';

export default ({ data }) => {
	const { edges: posts } = data.allAirtable;

	return (
		<Layout>
			<SEO title="Home" keywords={['treadtalks', 'talks', 'sermons']} />

			<ol>
				{posts.map(({ node: { id, fields, data: post } }) => (
					<li key={id} id={id}>
						<Link to={`/talks/${fields.slug}`}>{post.title}</Link>
					</li>
				))}
			</ol>
		</Layout>
	);
};

export const pageQuery = graphql`
	query {
		allAirtable(limit: 5, filter: { queryName: { eq: "PUBLISHED_TALKS" } }) {
			edges {
				node {
					id
					data {
						title
						link
						scripture
						speakers {
							id
							data {
								name
							}
						}
					}
					fields {
						slug
					}
				}
			}
		}
	}
`;
