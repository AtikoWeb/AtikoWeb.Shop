import axios from 'axios';

const currentDomain = window.location.hostname === 'localhost' ? process.env.REACT_APP_DOMAIN : window.location.hostname;


const baseURL = `https://${currentDomain}/api/client`
const instance = axios.create({
    baseURL: baseURL
});


export default instance;
