import axios from "axios";

const instance = axios.create({
    baseURL:'https://us-central1-challenge-bde28.cloudfunctions.net/api'   //THE API URL

    //http://localhost:5001/challenge-bde28/us-central1/api
});

export default instance;


//https://us-central1-challenge-bde28.cloudfunctions.net/api