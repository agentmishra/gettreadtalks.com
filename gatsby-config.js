const config = require('./config');

require('dotenv').config({
	path: `.env`,
});

const publishedTalksQuery = `{
	allAirtable(
		filter: { queryName: { eq: "PUBLISHED_TALKS" } }
		sort: { fields: data___publishedDate, order: DESC }
	) {
		edges {
			node {
				id
				fields {
					slug
				}
				data {
					title
					scripture
					speakers {
						id
						fields {
							slug
						}
						data {
							title
						}
					}
				}
			}
		}
	}
}`;

const searchQueries = [
	{
		indexName: `prod_PUBLISHED_TALKS`,
		query: publishedTalksQuery,
		transformer: ({ data }) => data.allAirtable.edges.map(({ node }) => node), // optional
		settings: {
			attributesToSnippet: ['path:5', 'internal'],
		},
	},
];

module.exports = {
	siteMetadata: {
		keywords: 'wordpress, themes, wp, wp.com, wpcom, premium, free',
		...config,
	},
	plugins: [
		'gatsby-plugin-react-helmet',
		'gatsby-plugin-robots-txt',
		'gatsby-plugin-sharp',
		'gatsby-plugin-sitemap',
		'gatsby-plugin-styled-components',
		'gatsby-plugin-tailwindcss',
		`gatsby-transformer-remark`,
		'gatsby-transformer-sharp',
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/assets/images`,
			},
		},
		{
			resolve: `gatsby-plugin-algolia`,
			options: {
				appId: process.env.ALGOLIA_APP_ID,
				apiKey: process.env.ALGOLIA_API_KEY_ADMIN,
				indexName: process.env.ALGOLIA_INDEX_NAME,
				queries: searchQueries,
				chunkSize: 10000, // default: 1000
			},
		},
		{
			resolve: `gatsby-plugin-google-tagmanager`,
			options: {
				id: 'GTM-TZ97LN8',
			},
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					{
						resolve: `@raae/gatsby-remark-oembed`,
						options: {
							providers: {
								include: ['Vimeo', 'YouTube'],
							},
						},
					},
				],
			},
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: config.title,
				short_name: config.title,
				description: config.description,
				start_url: '/',
				background_color: config.backgroundColor,
				theme_color: config.themeColor,
				display: 'minimal-ui',
				icon: config.icon,
			},
		},
		{
			resolve: `gatsby-source-airtable`,
			options: {
				apiKey: process.env.AIRTABLE_API_KEY,
				tables: [
					{
						baseId: process.env.AIRTABLE_BASE,
						tableName: `Affiliate Links`,
						tableView: `Published`,
						queryName: `PUBLISHED_AFFILIATE_LINKS`,
						mapping: {
							image: `fileNode`,
							description: `text/markdown`,
							link: `text/markdown`,
						},
					},
					{
						baseId: process.env.AIRTABLE_BASE,
						tableName: `Clips`,
						tableView: `Published`,
						queryName: `PUBLISHED_CLIPS`,
						tableLinks: [`speakers`, `topics`, `talks`],
						mapping: {
							link: `text/markdown`,
						},
					},
					{
						baseId: process.env.AIRTABLE_BASE,
						tableName: `Pages`,
						tableView: `Published`,
						queryName: `PUBLISHED_PAGES`,
						mapping: {
							content: `text/markdown`,
						},
					},
					{
						baseId: process.env.AIRTABLE_BASE,
						tableName: `Series`,
						tableView: `Published`,
						queryName: `PUBLISHED_SERIES`,
						tableLinks: [`talks`],
						mapping: {
							link: `text/markdown`,
						},
					},
					{
						baseId: process.env.AIRTABLE_BASE,
						tableName: `Speakers`,
						tableView: `Published`,
						queryName: `PUBLISHED_SPEAKERS`,
						tableLinks: [`clips`, `talks`],
						mapping: {
							avatar: `fileNode`,
							description: `text/markdown`,
						},
					},
					{
						baseId: process.env.AIRTABLE_BASE,
						tableName: `Talks`,
						tableView: `Published`,
						queryName: `PUBLISHED_TALKS`,
						tableLinks: [`series`, `speakers`, `topics`],
						mapping: {
							link: `text/markdown`,
						},
					},
					{
						baseId: process.env.AIRTABLE_BASE,
						tableName: `Topics`,
						tableView: `Published`,
						queryName: `PUBLISHED_TOPICS`,
						tableLinks: [`clips`, `talks`],
					},
				],
			},
		},
		`gatsby-plugin-netlify`,
	],
};
