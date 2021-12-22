import axios from 'axios';
export default axios.create({
    baseURL:"https://nepalvotes.info",
    headers:{
        "Content-type":"application/json"
    }
});