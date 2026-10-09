
import axios from "axios";

const API_URL = "http://localhost:5000/api/favorites";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Add product to favorites
export const addFavorite = async (productId) => {
    const response = await axios.post(
        API_URL,
        {
            productId,
        },
        getAuthConfig()
    );

    return response.data;
};

// Get customer's favorites
export const getFavorites = async () => {
    const response = await axios.get(
        API_URL,
        getAuthConfig()
    );

    return response.data;
};

// Remove product from favorites
export const removeFavorite = async (productId) => {
    const response = await axios.delete(
        `${API_URL}/remove`,
        {
            ...getAuthConfig(),
            data: {
                productId,
            },
        }
    );

    return response.data;
};

