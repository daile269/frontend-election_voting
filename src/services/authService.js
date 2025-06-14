import { jwtDecode } from "jwt-decode";
import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8080/api/auth";

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const token = response.data.token;
    localStorage.setItem("token", token);

    const user = await decodeToken(token);

    localStorage.setItem("currentUser", JSON.stringify(user));

    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Thông tin đăng nhập không chính xác");
  }
};

export const registerUser = async (user) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/register`,
      user
    );

    return response.data.result;
  } catch (error) {
    console.error("Register failed:", error);
    throw new Error("Email hoặc tên đăng nhập đã tồn tại");
  }
};

export const verifyUser = async (verifyRequest) => {
  try {
    const response = await axiosInstance.patch(
      `http://localhost:8080/api/auth/verifyUser`,
      verifyRequest
    );
    const data = response.data;
    if (parseInt(data.code) === 200) {
      return data.message;
    } else {
      throw new Error(data.message || "Xác thực thất bại");
    }
  } catch (error) {
    const message =
      error.response?.data?.message || "Không thể xác thực tài khoản";
    console.error("Verify failed:", message);
    throw new Error(message);
  }
};

const decodeToken = async (token) => {
  const decoded = jwtDecode(token);
  const username = decoded.sub;
  const response = await axiosInstance.get(
    `http://localhost:8080/api/users/find-user/${username}`
  );
  return response.data;
};

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const user = await decodeToken(token);
    return user;
  } catch {
    logoutService();
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};
export const logoutService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
};
