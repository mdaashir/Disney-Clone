import { useRef } from "react";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";
import { SliderSkeleton } from "./Skeletons";
import { fetchTrending, imageBaseUrl } from "@/api/tmdb";

function Slider() {
  const elementRef = useRef(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
  });

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1280;

  const sliderRight = (element) => {
    if (element) element.scrollLeft += screenWidth - 110;
  };
  const sliderLeft = (element) => {
    if (element) element.scrollLeft -= screenWidth - 110;
  };

  return (
    <div className="relative">
      <HiChevronLeft
        className="hidden md:block text-white text-[30px] absolute mx-8 mt-[155px] cursor-pointer"
        onClick={() => sliderLeft(elementRef.current)}
        aria-label="Scroll left"
        role="button"
      />
      <HiChevronRight
        className="hidden md:block text-white text-[30px] absolute mx-8 mt-[155px] cursor-pointer right-0"
        onClick={() => sliderRight(elementRef.current)}
        aria-label="Scroll right"
        role="button"
      />
      <div
        className="flex overflow-x-auto w-full px-16 py-4 scrollbar-none scroll-smooth"
        ref={elementRef}
      >
        {isLoading && <SliderSkeleton />}
        {isError && (
          <div className="w-full h-[310px] flex items-center justify-center text-red-400">
            Failed to load trending videos.
          </div>
        )}
        {data &&
          data.map((item) =>
            item.backdrop_path ? (
              <img
                key={item.id}
                src={imageBaseUrl + item.backdrop_path}
                alt={item.title || item.name || "Trending media"}
                className="min-w-full md:h-[310px] object-cover object-left-top mr-5 rounded-md hover:border-[4px] border-gray-400 transition-all duration-100 ease-in"
              />
            ) : null,
          )}
      </div>
    </div>
  );
}

export default Slider;
