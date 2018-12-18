/* global tw */
import styled from 'styled-components';
import React from 'react';
import { flattenObjectsByKey } from '../../utils';

import Speaker from './card';

const Speakers = styled.div`
	${tw`mb-20`};
`;

export default ({ data }) => {
	const posts = flattenObjectsByKey(data, 'node');

	return (
		<Speakers>
			{posts.map(post => (
				<Speaker
					key={post.id}
					id={post.id}
					post={post.data}
					slug={post.fields.slug}
				/>
			))}
		</Speakers>
	);
};
