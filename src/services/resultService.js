import axiosInstance from "./axiosInstance";

const API_URL_GET = "http://localhost:8080/api/results";

export const getResults = async () => {
  const response = await axiosInstance.get(API_URL_GET);
  return response.data;
};

export const getResultForElection = async (electionId) => {
  const response = await axiosInstance.get(
    `${API_URL_GET}/election/${electionId}`
  );
  return response.data;
};
