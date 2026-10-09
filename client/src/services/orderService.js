import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Create normal order from cart
export const createNormalOrder = async (shippingAddress) => {
    const response = await axios.post(
        `${API_URL}/normal`,
        {
            shippingAddress,
        },
        getAuthConfig()
    );

    return response.data;
};

// Get customer's orders
export const getCustomerOrders = async () => {
    const response = await axios.get(
        `${API_URL}/customer`,
        getAuthConfig()
    );

    return response.data;
};

// Get single order
export const getOrderById = async (orderId) => {
    const response = await axios.get(
        `${API_URL}/${orderId}`,
        getAuthConfig()
    );

    return response.data;
};

// Get order tracking
export const getOrderTracking = async (orderId) => {
    const response = await axios.get(
        `${API_URL}/${orderId}/tracking`,
        getAuthConfig()
    );

    return response.data;
};

// Cancel order
export const cancelOrder = async (orderId) => {
    const response = await axios.put(
        `${API_URL}/${orderId}/cancel`,
        {},
        getAuthConfig()
    );

    return response.data;
};


export const createCustomOrder = async (
    customRequestId,
    shippingAddress,
    deliveryCharge = 50
) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API_URL}/custom/${customRequestId}`,
        {
            shippingAddress,
            deliveryCharge,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

