import axiosInstance from "./axiosInstance";

const API_URL_GET = "http://localhost:8080/api/candidates";
const API_URL_PAGINATED = "http://localhost:8080/api/candidates/paginated";

export const getCandidates = async () => {
  const response = await axiosInstance.get(API_URL_GET);
  return response.data;
};

export const getCandidatesPaginated = async (page, size) => {
  const response = await axiosInstance.get(API_URL_PAGINATED, {
    params: { page, size },
  });
  return response.data;
};

export const getCandidateById = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/candidates/${id}`
  );
  return response.data;
};
export const getCandidateByElectionId = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/candidates/election/${id}`
  );
  return response.data;
};
export const getCandidateNotInELection = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/candidates/not-in-election/${id}`
  );
  return response.data;
};

export const getCandidateByUserId = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/candidates/user-vote/${id}`
  );
  return response.data;
};

export const createCandidate = async (candidate) => {
  try {
    const response = await axiosInstance.post(
      `http://localhost:8080/api/candidates`,
      candidate
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo ứng viên:", error);
    throw error;
  }
};

export const updateCandidate = async (id, candidate) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:8080/api/candidates/${id}`,
      candidate
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin ứng viên", error);
    throw error;
  }
};
export const updateImageCandidate = async (id, selectedFile) => {
  try {
    const formData = new FormData();
    formData.append("image", selectedFile);
    const response = await axiosInstance.patch(
      `http://localhost:8080/api/candidates/upload-image/${id}`,
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

export const deleteCandidate = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `http://localhost:8080/api/candidates/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa cuộc bầu cử:", error);
    throw error;
  }
};
