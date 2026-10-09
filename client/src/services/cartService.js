import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  const response = await axios.post(
    `${API_URL}/add`,
    {
      productId,
      quantity,
    },
    getAuthConfig()
  );

  return response.data;
};

// Get customer cart
export const getCart = async () => {
  const response = await axios.get(
    API_URL,
    getAuthConfig()
  );

  return response.data;
};

// Update cart quantity
export const updateCartQuantity = async (productId, quantity) => {
  const response = await axios.put(
    `${API_URL}/update`,
    {
      productId,
      quantity,
    },
    getAuthConfig()
  );

  return response.data;
};

// Remove product from cart
export const removeFromCart = async (productId) => {
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