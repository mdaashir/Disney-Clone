import { imageBaseUrl } from "@/api/tmdb";
import WatchlistButtons from "@/Components/watchlist/WatchlistButtons";
import { LazyImage } from "@/Components/optimization/LazyImage";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function MovieCard({ movie, showWatchlistButtons = true }) {
  const navigate = useNavigate();
  const alt = movie.title || movie.name || "Movie poster";

  if (!movie.poster_path) return null;

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="relative group">
      <LazyImage
        src={imageBaseUrl + movie.poster_path}
        alt={alt}
        className="w-[110px] md:w-[200px] rounded-lg hover:border-[3px] border-gray-400 hover:scale-110 transition-all duration-150 ease-in cursor-pointer"
        onClick={handleClick}
        sizes="(max-width: 768px) 110px, 200px"
        quality={80}
      />

      {/* Watchlist Buttons Overlay */}
      {showWatchlistButtons && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WatchlistButtons movie={movie} variant="overlay" size="sm" />
        </div>
      )}

      {/* Movie Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-white text-xs md:text-sm font-medium line-clamp-2">
            {movie.title || movie.name}
          </h3>
          {movie.vote_average > 0 && (
            <div className="flex items-center mt-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-white text-xs ml-1">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    name: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
  }).isRequired,
  showWatchlistButtons: PropTypes.bool,
};

export default MovieCard;
