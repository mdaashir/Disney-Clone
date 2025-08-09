import PropTypes from 'prop-types';

export default function Skeleton({ className = '' }) {
	return (
		<div
			className={`animate-pulse bg-gradient-to-r from-gray-700/40 via-gray-600/40 to-gray-700/40 rounded ${className}`}
			role="status"
			aria-label="Loading"
		/>
	);
}

Skeleton.propTypes = {
	className: PropTypes.string,
};
