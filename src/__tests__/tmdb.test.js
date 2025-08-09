import { describe, it, expect, vi, beforeEach } from 'vitest';

let client;
vi.mock('axios', () => {
	client = { get: vi.fn(), interceptors: { response: { use: vi.fn() } } };
	return { default: { create: () => client } };
});

let fetchTrending;
let fetchByGenre;
const mockResults = [
	{ id: 1, title: 'Movie 1' },
	{ id: 2, title: 'Movie 2' },
];

describe('tmdb api', () => {
	beforeEach(async () => {
		// Dynamic import AFTER mock so axios mock is used
		({ fetchTrending, fetchByGenre } = await import('../../src/api/tmdb'));
		client.get.mockImplementation((url) => {
			if (url.startsWith('/trending')) {
				return Promise.resolve({ data: { results: mockResults } });
			}
			if (url.startsWith('/discover/movie')) {
				return Promise.resolve({ data: { results: mockResults } });
			}
			return Promise.reject(new Error('unknown endpoint'));
		});
	});

	it('fetchTrending returns results', async () => {
		const results = await fetchTrending();
		expect(results).toEqual(mockResults);
		expect(client.get).toHaveBeenCalledWith('/trending/all/day');
	});

	it('fetchByGenre returns results', async () => {
		const results = await fetchByGenre(28);
		expect(results).toEqual(mockResults);
		expect(client.get).toHaveBeenCalledWith('/discover/movie', {
			params: { with_genres: 28 },
		});
	});
});
