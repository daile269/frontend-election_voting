import axiosInstance from "./axiosInstance";

const API_URL_GET = "http://localhost:8080/api/elections";
const API_URL_PAGINATED = "http://localhost:8080/api/elections/filter";

export const getElections = async () => {
  const response = await axiosInstance.get(API_URL_GET);
  return response.data;
};

export const getElectionsPaginated = async (search, status, page, size) => {
  const response = await axiosInstance.get(API_URL_PAGINATED, {
    params: { search, status, page, size },
  });
  return response.data;
};

export const getElectionById = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/elections/${id}`
  );
  return response.data;
};
export const getElectionByCandidateId = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/elections/candidate/${id}`
  );
  return response.data;
};

export const getElectionsForUser = async (id, page, size) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/elections/user/${id}/paginated`,
    {
      params: { page, size },
    }
  );
  return response.data;
};
export const createElection = async (election) => {
  try {
    const response = await axiosInstance.post(
      `http://localhost:8080/api/elections`,
      election
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo cuộc bầu cử:", error);
    throw error;
  }
};

export const updateElection = async (id, updatedElection) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:8080/api/elections/${id}`,
      updatedElection
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật cuộc bầu cử:", error);
    throw error;
  }
};

export const deleteElection = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `http://localhost:8080/api/elections/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa cuộc bầu cử:", error);
    throw error;
  }
};
export const addCandidateToElection = async (id, candidateIds) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:8080/api/elections/add-candidate/${id}`,
      { candidateIds }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm ứng viên:", error);
    throw error;
  }
};
export const addUsersToElection = async (id, userIds) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:8080/api/elections/add-users/${id}`,
      { userIds }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm ứng viên:", error);
    throw error;
  }
};

export const deleteUsersToElection = async (id, userIds) => {
  try {
    const response = await axiosInstance.delete(
      `http://localhost:8080/api/elections/remove-users/${id}`,
      {
        data: { userIds },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa ứng viên:", error);
    throw error;
  }
};

export const deleteCandidateFromElection = async (id, candidateId) => {
  try {
    const response = await axiosInstance.delete(
      `http://localhost:8080/api/elections/remove-candidate/${id}/${candidateId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm ứng viên:", error);
    throw error;
  }
};

export const getResultElection = async (id) => {
  try {
    const response = await axiosInstance.get(
      `http://localhost:8080/api/elections/${id}/candidates`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi :", error);
    throw error;
  }
};
