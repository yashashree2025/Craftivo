
import axios from "axios";

const API_URL = "http://localhost:5000/api/custom-requests";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Create a new custom request
export const createCustomRequest = async (customRequestData) => {
    const response = await axios.post(
        API_URL,
        customRequestData,
        getAuthConfig()
    );

    return response.data;
};

// Get customer's custom requests
export const getCustomerRequests = async () => {
    const response = await axios.get(
        `${API_URL}/customer`,
        getAuthConfig()
    );

    return response.data;
};

// Customer approves or rejects artisan response
export const customerRespondToRequest = async (
    requestId,
    status
) => {
    const response = await axios.put(
        `${API_URL}/${requestId}/customer-response`,
        {
            status,
        },
        getAuthConfig()
    );

    return response.data;
};

// Get artisan's custom requests
export const getArtisanRequests = async () => {
    const response = await axios.get(
        `${API_URL}/artisan`,
        getAuthConfig()
    );

    return response.data;
};

// Artisan accepts or rejects a custom request
export const respondToCustomRequest = async (
    requestId,
    data
) => {
    const response = await axios.put(
        `${API_URL}/${requestId}/respond`,
        data,
        getAuthConfig()
    );

    return response.data;
};

