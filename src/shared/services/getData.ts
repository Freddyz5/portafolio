import { separateLanguages } from '../utils/languageSeparator';
// import data from '../../resume.json'

type LanguageType = 'es' | 'en';

export const getData = async (
	language: LanguageType = 'es'
): Promise<any> => {
	const accessKey = import.meta.env.PUBLIC_ACCESS_KEY;
	const endpoint = import.meta.env.PUBLIC_JSON_ENDPOINT;

	if (!accessKey || !endpoint) {
		throw new Error(
			'Missing required environment variables: PUBLIC_ACCESS_KEY and/or PUBLIC_JSON_ENDPOINT'
		);
	}

	try {
		const headers = new Headers();
		headers.append('X-Access-Key', accessKey);

		const response = await fetch(endpoint, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch data: ${response.status} ${response.statusText}`
			);
		}

		const responseJson = await response.json();

		if (!responseJson || typeof responseJson !== 'object') {
			throw new Error('Invalid response format: expected an object');
		}

		if (!('record' in responseJson)) {
			throw new Error('Invalid response structure: missing "record" property');
		}

		const record = responseJson.record;
		// const record = data;

		return separateLanguages(record, language);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(`Unexpected error while fetching data: ${String(error)}`);
	}
};