import { useState } from 'react';
import './App.css';
import React from 'react';
import Header from './Components/Header';
import Slider from './Components/Slider';

function App() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<Header />
			<Slider />
		</div>
	);
}

export default App;
