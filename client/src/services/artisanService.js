import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const getArtisans = async () => {
    const response = await axios.get(`${API_URL}/artisans`);
    return response.data;
};