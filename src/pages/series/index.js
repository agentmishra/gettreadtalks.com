import React from 'react';
import { graphql } from 'gatsby';

import SEO from '../../components/seo';
import Series from '../../components/series';
import Section, { Content, Heading, Sidebar } from '../../components/section';

export default function SeriesPage({ data, location }) {
	const { series } = data;

	return (
		<>
			<SEO title="Sermon Series" location={location} />

			<Section>
				<Sidebar>
					<Heading>Sermon Series</Heading>
					<div className="prose">
						<p>
							Each series includes talks that were given by one or more speakers
							on the same topic or book of the Bible.
						</p>
					</div>
				</Sidebar>
				<Content>
					<Series className="grid grid-cols-1 gap-6" series={series.nodes} />
				</Content>
			</Section>
		</>
	);
}

export const query = graphql`
	query {
		series: allAirtableSerie(
			filter: { data: { title: { ne: null } } }
			sort: { fields: data___title, order: ASC }
		) {
			nodes {
				id
				fields {
					slug
				}
				data {
					title
					publishedTalksCount
				}
			}
		}
	}
`;
