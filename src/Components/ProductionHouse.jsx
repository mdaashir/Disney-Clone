// @ts-nocheck
import React from 'react';
import disney from '../Assets/Images/disney.png';
import marvel from '../Assets/Images/marvel.png';
import nationalG from '../Assets/Images/nationalG.png';
import pixar from '../Assets/Images/pixar.png';
import starwar from '../Assets/Images/starwar.png';

import starwarV from '../Assets/Videos/star-wars.mp4';
import marvelV from '../Assets/Videos/marvel.mp4';
import disneyV from '../Assets/Videos/disney.mp4';
import pixarV from '../Assets/Videos/pixar.mp4';
import nationalGeographicV from '../Assets/Videos/national-geographic.mp4';

function ProductionHouse() {
	const productionHouseList = [
		{
			id: 1,
			image: disney,
			video: disneyV,
		},
		{
			id: 2,
			image: pixar,
			video: pixarV,
		},
		{
			id: 3,
			image: marvel,
			video: marvelV,
		},
		{
			id: 4,
			image: starwar,
			video: starwarV,
		},
		{
			id: 5,
			image: nationalG,
			video: nationalGeographicV,
		},
	];
	return (
		<div className='flex gap-2 md:gap-5 p-2 px-5 md:px-16 '>
			{productionHouseList.map((item) => (
				<div
					className='border-[2px] border-gray-600 rounded-lg hover:scale-110 transition-all duration-300
					ease-in-out cursor-pointer relative shadow-xl shadow-gray-800'
					key={item.id}>
					<video
						src={item.video}
						autoPlay
						loop
						playsInline
						muted
						className='absolute top-0 rounded-md z-0 opacity-0 hover:opacity-50'
					/>
					<img src={item.image} className='w-full z-[1] opacity-100' />
				</div>
			))}
		</div>
	);
}

export default ProductionHouse;
