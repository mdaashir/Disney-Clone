import { imageBaseUrl } from '../api/tmdb';
import PropTypes from 'prop-types';

function MovieCard({ movie }) {
	const alt = movie.title || movie.name || 'Movie poster';
	if (!movie.poster_path) return null;
	return (
		<img
			src={imageBaseUrl + movie.poster_path}
			alt={alt}
			loading='lazy'
			className='w-[110px] md:w-[200px] rounded-lg hover:border-[3px] border-gray-400 hover:scale-110 transition-all duration-150 ease-in cursor-pointer'
		/>
	);
}

MovieCard.propTypes = {
	movie: PropTypes.shape({
		id: PropTypes.number,
		title: PropTypes.string,
		name: PropTypes.string,
		poster_path: PropTypes.string,
	}).isRequired,
};

export default MovieCard;
