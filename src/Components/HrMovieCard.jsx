import { imageBaseUrl } from "../api/tmdb";
import PropTypes from "prop-types";

function HrMovieCard({ movie }) {
  if (!movie.backdrop_path) return null;
  const title = movie.title || movie.name || "Movie";
  return (
    <section className="hover:scale-110 transition-all duration-150 ease-in">
      <img
        src={imageBaseUrl + movie.backdrop_path}
        alt={title}
        loading="lazy"
        className="w-[110px] md:w-[260px] rounded-lg hover:border-[3px] border-gray-400 cursor-pointer"
      />
      <h2 className="w-[110px] md:w-[260px] text-white mt-2 ">{title}</h2>
    </section>
  );
}

HrMovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    name: PropTypes.string,
    backdrop_path: PropTypes.string,
  }).isRequired,
};

export default HrMovieCard;
