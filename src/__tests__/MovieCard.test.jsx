import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MovieCard from '../Components/MovieCard';

describe('MovieCard', () => {
	it('renders poster when poster_path exists', () => {
		render(
			<MovieCard movie={{ id: 1, title: 'Test', poster_path: '/path.jpg' }} />
		);
		const img = screen.getByAltText('Test');
		expect(img).toBeInTheDocument();
	});

	it('returns null when no poster_path', () => {
		const { container } = render(
			<MovieCard movie={{ id: 1, title: 'No Poster' }} />
		);
		expect(container.querySelector('img')).toBeNull();
	});
});
