import { array, shape, number, string, oneOfType } from 'prop-types';
// import { talkType } from './talk';

export const speakerType = shape({
	description: string,
	firstName: string,
	id: string.isRequired,
	lastName: string,
	ministry: string,
	path: string,
	publishedTalksCount: oneOfType([number, string]),
	role: string,
	talks: array,
	title: string.isRequired,
	website: string,
});

export const speakerDefaults = {
	talks: [],
};
