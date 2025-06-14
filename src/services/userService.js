import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8080/api/users";
const API_URL_PAGINATED = "http://localhost:8080/api/users/paginated";

export const getUsers = async () => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

export const getUsersPaginated = async (page, size) => {
  const response = await axiosInstance.get(API_URL_PAGINATED, {
    params: { page, size },
  });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};
export const getUserByElectionId = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/users/election/${id}`
  );
  return response.data;
};

export const getUserNotInELection = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/users/not-in-election/${id}`
  );
  return response.data;
};

export const createUser = async (user) => {
  try {
    const response = await axiosInstance.post(API_URL, user);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo người dùng", error);
    throw error;
  }
};
export const updateUser = async (id, user) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, user);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng", error);
    throw error;
  }
};
export const updateImageUser = async (id, selectedFile) => {
  try {
    console.log("file:", selectedFile);
    const formData = new FormData();
    formData.append("image", selectedFile);
    const response = await axiosInstance.patch(
      `${API_URL}/upload-image/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Data:" + response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server responded with an error:", error.response.data);
    } else if (error.request) {
      console.error("No response was received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/reset-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const sendVerifyCode = async (username) => {
  try {
    const response = await axiosInstance.post(
      `http://localhost:8080/api/send-verify-code`,
      {
        username,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const changePassword = async (ChangePassword) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:8080/api/users/change-password`,
      ChangePassword
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const updateAvatarUser = async (id, selectedFile) => {
  try {
    const formData = new FormData();
    formData.append("image", selectedFile);
    const response = await axiosInstance.patch(
      `http://localhost:8080/api/users/upload-image/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server responded with an error:", error.response.data);
    } else if (error.request) {
      console.error("No response was received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};
