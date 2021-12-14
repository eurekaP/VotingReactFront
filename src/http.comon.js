import axios from 'axios';
export default axios.create({
    baseURL:"http://159.223.87.19:8080",
    headers:{
        "Content-type":"application/json"
    }
});