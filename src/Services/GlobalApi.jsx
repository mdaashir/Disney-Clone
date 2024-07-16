import axios from 'axios';

const movieBaseUrl = 'https://api.themoviedb.org/3';
const api_key = '21453a69eabf45f0a56b51202e353808';
const getTrendingVideos = axios.get(
	movieBaseUrl + '/trending/all/day?api_key=' + api_key
);

export default getTrendingVideos;
