/* global tw */
import styled from 'styled-components';
import React from 'react';
import { graphql } from 'gatsby';
import Link from '../components/link';
import { mapObjectToString, objectToString } from '../utils';

import Layout from '../layouts';
import SEO from '../components/seo';
import Intro from '../components/intro';
import Topics from '../components/topics';
import Speakers from '../components/speakers';

import { Container, Section, SectionTitle } from '../components/styled/layout';
import { SecondaryButton } from '../components/styled/button';

const TalkLink = styled(SecondaryButton)`
	${tw`m-auto mt-16`};
	${tw`md:w-1/3`};
`;

export default props => {
	const { data: post } = props.data.airtable;

	const meta = {
		title: post.title,
		speakers: post.speakers
			? `<em>by</em> ${post.speakers.map(({ data }) => data.name).join(', ')}`
			: null,
		scripture: post.scripture ? `<em>from</em> ${post.scripture}` : null,
		topics: post.topics
			? `<em>on</em> ${post.topics.map(({ data }) => data.name).join(', ')}`
			: null,
	};

	return (
		<Layout>
			<SEO
				title={mapObjectToString(['title', 'speakers'], meta)}
				description={objectToString(meta)}
			/>

			<Intro
				title={post.title}
				excerpt={mapObjectToString(['speakers', 'scripture'], meta)}
			>
				<p>
					<TalkLink to={post.link} as={Link} large={1}>
						Listen to Talk &rarr;
					</TalkLink>
				</p>
			</Intro>

			<Container>
				{post.speakers && (
					<Section>
						<SectionTitle>
							{1 === post.speakers.length ? `Speaker` : `Speakers`}
						</SectionTitle>
						<Speakers data={post.speakers} />
					</Section>
				)}

				{post.topics && (
					<Section>
						<SectionTitle>
							{1 === post.topics.length ? `Topic` : `Topics`}
						</SectionTitle>
						<Topics data={post.topics} />
					</Section>
				)}
			</Container>
		</Layout>
	);
};

export const pageQuery = graphql`
	query($id: String!) {
		airtable(id: { eq: $id }) {
			id
			data {
				title
				link
				scripture
				topics {
					id
					fields {
						slug
					}
					data {
						name
						publishedTalksCount
					}
				}
				speakers {
					id
					fields {
						slug
					}
					data {
						name
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
