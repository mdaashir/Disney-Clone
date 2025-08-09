import GlobalApi from '../Services/GlobalApi';

function MovieCard({ movie }) {
	const alt = movie.title || movie.name || 'Movie poster';
	if (!movie.poster_path) return null;
	return (
		<img
			src={GlobalApi.imageBaseUrl + movie.poster_path}
			alt={alt}
			loading='lazy'
			className='w-[110px] md:w-[200px] rounded-lg hover:border-[3px] border-gray-400 hover:scale-110 transition-all duration-150 ease-in cursor-pointer'
		/>
	);
}

export default MovieCard;
