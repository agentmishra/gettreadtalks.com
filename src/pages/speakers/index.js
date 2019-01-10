import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../components/layout';
import Intro from '../../components/intro';
import SEO from '../../components/seo';
import { Container, Section } from '../../components/styled/layout';
import Speakers from '../../components/speakers';

export default ({ data }) => {
	const { edges: posts = [] } = data.allAirtable;

	return (
		<Layout>
			<SEO title="Speakers" keywords={['speakers', 'pastors', 'evangelists']} />

			<Intro title="Speakers" />

			<Container>
				<Section>
					<Speakers data={posts} />
				</Section>
			</Container>
		</Layout>
	);
};

export const pageQuery = graphql`
	query {
		allAirtable(
			filter: {
				queryName: { eq: "PUBLISHED_SPEAKERS" }
				data: { title: { ne: null } }
			}
			sort: { fields: data___lastName, order: ASC }
		) {
			edges {
				node {
					id
					fields {
						slug
					}
					data {
						title
						role
						ministry
						website
						avatar {
							localFiles {
								childImageSharp {
									fluid(maxWidth: 128) {
										...GatsbyImageSharpFluid_tracedSVG
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;
