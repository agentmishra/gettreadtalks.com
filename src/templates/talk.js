import React from "react";
import { graphql } from "gatsby";

export default ( props ) => {
	const { data: post } = props.data.airtable;

	return (
		<h2>{post.title}</h2>
	);
}

export const pageQuery = graphql`
  query getTalkByTitle($title: String!) {
    airtable(table: { eq: "Talks" }, data: { title: { eq: $title } }) {
      id
      data {
				title
      }
    }
  }
`;
