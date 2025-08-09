import { useState } from 'react';
// @ts-ignore
import logo from './../Assets/Images/logo.png';
import {
	HiHome,
	HiMagnifyingGlass,
	HiPlayCircle,
	HiStar,
	HiTv,
} from 'react-icons/hi2';
import { HiDotsVertical, HiPlus } from 'react-icons/hi';
import HeaderItem from './HeaderItem';

function Header() {
	const [toggle, setToggle] = useState(false);
	const menu = [
		{
			name: 'HOME',
			icon: HiHome,
		},
		{
			name: 'SEARCH',
			icon: HiMagnifyingGlass,
		},
		{
			name: 'WATCH LIST',
			icon: HiPlus,
		},
		{
			name: 'ORIGINALS',
			icon: HiStar,
		},
		{
			name: 'MOVIES',
			icon: HiPlayCircle,
		},
		{
			name: 'SERIES',
			icon: HiTv,
		},
	];
	return (
		<header className='flex items-center justify-between p-5' role='banner'>
			<div className='flex gap-8 items-center'>
				<img src={logo} className='w-[80px] md:w-[115px] object-cover' />
				<div className='hidden md:flex gap-8'>
					{menu.map((item,index) => (
						<HeaderItem name={item.name} Icon={item.icon} key={index}/>
					))}
				</div>
				<div className='flex md:hidden gap-5'>
					{menu.map(
						(item, index) =>
							index < 3 && <HeaderItem name={''} Icon={item.icon} key={index} />
					)}
				</div>
				<button
					className='md:hidden'
					type='button'
					aria-label='More navigation'
					aria-expanded={toggle}
					onClick={() => setToggle(!toggle)}>
					<HeaderItem name={''} Icon={HiDotsVertical} />
					{toggle ? (
						<nav className='absolute mt-3 bg-[#121212] border-[1px]  border-gray-700 p-3 px-5 py-4' aria-label='Mobile navigation'>
							{menu.map(
								(item, index) =>
									index > 2 && <HeaderItem name={item.name} Icon={item.icon} key={index}/>
							)}
						</nav>
					) : null}
				</button>
			</div>
			<img
				src='http://plugins.svn.wordpress.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'
				alt='User avatar'
				className='w-[40px] rounded-full'
			/>
		</header>
	);
}

export default Header;
