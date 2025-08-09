import { useRef } from "react";
import MovieCard from "./MovieCard";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import HrMovieCard from "./HrMovieCard";
import { useQuery } from "@tanstack/react-query";
import { MovieRowSkeleton } from "./Skeletons";
import { fetchByGenre } from "@/api/tmdb";

function MovieList({ genreId, index_ }) {
  const elementRef = useRef(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["genre", genreId],
    queryFn: () => fetchByGenre(genreId),
  });

  const slideRight = (element) => {
    if (element) element.scrollLeft += 500;
  };
  const slideLeft = (element) => {
    if (element) element.scrollLeft -= 500;
  };

  return (
    <div className="relative">
      <IoChevronBackOutline
        className={`text-[50px] text-white p-2 z-10 cursor-pointer hidden md:block absolute ${index_ % 3 == 0 ? "mt-[70px]" : "mt-[150px]"}`}
        onClick={() => slideLeft(elementRef.current)}
        aria-label="Scroll left"
        role="button"
      />
      <div
        className="flex overflow-x-auto gap-8 scrollbar-none scroll-smooth pt-4 px-3 pb-4"
        ref={elementRef}
      >
        {isLoading && (
          <MovieRowSkeleton variant={index_ % 3 == 0 ? "backdrop" : "poster"} />
        )}
        {isError && <div className="text-red-400">Failed to load movies.</div>}
        {data &&
          data.map((item) =>
            index_ % 3 == 0 ? (
              <HrMovieCard movie={item} key={item.id} />
            ) : (
              <MovieCard movie={item} key={item.id} />
            ),
          )}
      </div>
      <IoChevronForwardOutline
        className={`text-[50px] text-white hidden md:block p-2 cursor-pointer z-10 top-0 absolute right-0 ${index_ % 3 == 0 ? "mt-[70px]" : "mt-[150px]"}`}
        onClick={() => slideRight(elementRef.current)}
        aria-label="Scroll right"
        role="button"
      />
    </div>
  );
}

import PropTypes from "prop-types";
MovieList.propTypes = {
  genreId: PropTypes.number.isRequired,
  index_: PropTypes.number.isRequired,
};

export default MovieList;
