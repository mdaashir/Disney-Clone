// Generic pulse skeleton block
export function SkeletonBlock({ className = '' }) {
	return (
		<div
			className={`animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-md ${className}`}
			aria-hidden='true'
		/>
	);
}

export function SliderSkeleton({ count = 3 }) {
	return (
		<div className='flex w-full' aria-label='Loading trending items'>
			{Array.from({ length: count }).map((_, i) => (
				<SkeletonBlock
					key={i}
					className='min-w-full md:h-[310px] h-[200px] mr-5'
				/>
			))}
		</div>
	);
}

export function MovieRowSkeleton({ count = 8, variant = 'poster' }) {
	return (
		<div className='flex gap-8' aria-label='Loading movies'>
			{Array.from({ length: count }).map((_, i) => (
				<SkeletonBlock
					key={i}
					className={
						variant === 'backdrop'
							? 'w-[260px] h-[146px] md:h-[146px]'
							: 'w-[110px] md:w-[200px] h-[165px] md:h-[300px]'
					}
				/>
			))}
		</div>
	);
}

import PropTypes from 'prop-types';
SkeletonBlock.propTypes = { className: PropTypes.string };
SliderSkeleton.propTypes = { count: PropTypes.number };
MovieRowSkeleton.propTypes = {
	count: PropTypes.number,
	variant: PropTypes.string,
};

export default { SkeletonBlock, SliderSkeleton, MovieRowSkeleton };
