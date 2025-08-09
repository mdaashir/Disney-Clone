import React from 'react';

function HeaderItem({ name, Icon }) {
	return (
		<div className='relative text-white flex items-center gap-3 text-[15px] font-semibold cursor-pointer  mb-3 '>
			<Icon />
			<h2 className='after:absolute after:-bottom-1 after:w-full after:h-1 after:bg-white after:rounded after:origin-bottom-right after:transition-transform after:duration-300 after:ease-out after:scale-x-0 after:left-0 hover:after:origin-bottom-left hover:after:scale-x-100'>
				{name}
			</h2>
		</div>
	);
}

export default HeaderItem;
