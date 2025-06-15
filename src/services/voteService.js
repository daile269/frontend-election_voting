import axiosInstance from "./axiosInstance";

const API_URL_GET = "http://localhost:8080/api/votes";
const API_URL_PAGINATED = "http://localhost:8080/api/votes/filter";

export const getVotes = async () => {
  const response = await axiosInstance.get(API_URL_GET);
  return response.data;
};

export const getVotesPaginated = async (page, size, selectedElection) => {
  const params = { page, size };
  if (selectedElection) {
    params.electionId = selectedElection;
  }

  const response = await axiosInstance.get(API_URL_PAGINATED, { params });
  return response.data;
};

export const getVotesForUser = async (id, page, size) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/votes/user/${id}/paginated`,
    {
      params: { page, size },
    }
  );
  return response.data;
};

export const getVotesById = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/votes/${id}`
  );
  return response.data;
};
export const getVotesByElectionId = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:8080/api/votes/election/${id}`
  );
  return response.data;
};
export const createVote = async (voteData, voteChoice) => {
  try {
    const response = await axiosInstance.post(
      `http://localhost:8080/api/votes?voteChoice=` + voteChoice,
      voteData
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
