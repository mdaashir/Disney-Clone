import React, { useEffect, useRef, useState } from 'react';
import GlobalApi from '../Services/GlobalApi';
import MovieCard from './MovieCard';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

function MovieList({ genreId }) {
	const [MovieList, setMovieList] = useState([]);
	const elementRef = useRef(null);
	useEffect(() => {
		getMovieByGenreId();
	}, []);
	const getMovieByGenreId = () => {
		GlobalApi.getMovieByGenreId(genreId).then((resp) => {
			setMovieList(resp.data.results);
		});
	};

	const slideRight = (element) => {
		element.scrollLeft += 500;
	};
	const slideLeft = (element) => {
		element.scrollLeft -= 500;
	};
	return (
		<div className='relative'>
			<IoChevronBackOutline
				className='text-[50px] text-white p-2 z-10 cursor-pointer hidden md:block absolute mt-[150px]'
				onClick={(e) => {
					e.defaultPrevented;
					slideLeft(elementRef.current);
				}}
			/>
			<div
				className='flex overflow-x-auto gap-8 scrollbar-none scroll-smooth pt-5 px-3 pb-5'
				ref={elementRef}>
				{MovieList.map((item) => (
					// @ts-ignore
					<MovieCard movie={item} key={item.id}/>
				))}
			</div>
			<IoChevronForwardOutline
				className='text-[50px] text-white hidden md:block p-2 cursor-pointer z-10 top-0 absolute right-0 mt-[150px]'
				onClick={(e) => {
					e.defaultPrevented;
					slideRight(elementRef.current);
				}}
			/>
		</div>
	);
}

export default MovieList;
