import React, { useEffect, useRef, useState } from 'react';
import getTrendingVideos from '../Services/GlobalApi';
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi2';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const screenWidth = window.innerWidth;

function Slider() {
	const [movieList, setMovieList] = useState([]);
	const elementRef = useRef(null);
	useEffect(() => {
		getTrendingMovies();
	}, []);
	const getTrendingMovies = () => {
		getTrendingVideos.then((resp) => {
			console.log(resp.data.results);
			setMovieList(resp.data.results);
		});
	};

	const sliderRight = (element) => {
		element.scrollLeft += screenWidth - 110;
	};
	const sliderLeft = (element) => {
		element.scrollLeft -= screenWidth - 110;
	};
	return (
		<div>
			<HiChevronLeft
				className='hidden md:block text-white text-[30px] absolute mx-8 mt-[155px] cursor-pointer'
				onClick={(e) => {
					e.defaultPrevented;
					sliderLeft(elementRef.current);
				}}
			/>
			<HiChevronRight
				className='hidden md:block text-white text-[30px] absolute mx-8 mt-[155px] cursor-pointer right-0'
				onClick={(e) => {
					e.defaultPrevented;
					sliderRight(elementRef.current);
				}}
			/>
			<div
				className='flex overflow-x-auto w-full px-16 py-4 scrollbar-none scroll-smooth'
				ref={elementRef}>
				{movieList.map((item, index) => (
					<img
						// @ts-ignore
						src={IMAGE_BASE_URL + item.backdrop_path}
						className='min-w-full md:h-[310px] object-cover object-left-top mr-5 rounded-md hover:border-[4px] border-gray-400 transition-all duration-100 ease-in'
						key={index}
					/>
				))}
			</div>
		</div>
	);
}

export default Slider;
