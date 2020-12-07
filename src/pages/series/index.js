import React from 'react';
import { graphql } from 'gatsby';

import Page from '../../components/page';
import SEO from '../../components/seo';
import Series from '../../components/series';
import Section from '../../components/section';

export default function SeriesPage({ data, location }) {
	const { series } = data;

	return (
		<>
			<SEO title="Sermon Series" location={location} />

			<Section>
				<Section.Sidebar sticky>
					<Page.Title>Series</Page.Title>

					<div className="mt-2 prose">
						<p>
							Each series includes talks given by one or more speakers on the
							same topic or book of the Bible.
						</p>
					</div>
				</Section.Sidebar>

				<Section.Content>
					<Series className="grid gap-6" series={series.nodes} />
				</Section.Content>
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
					speakers {
						id
						fields {
							slug
						}
						data {
							title
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
	}
`;
