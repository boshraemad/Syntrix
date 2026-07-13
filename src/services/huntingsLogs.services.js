import axiosInstance from "@/config/axiosInstance";

// 1. Execute Hunting Query (POST)
export async function executeHuntingQuery(data) {
  // data: { query: string, language: string }
  const res = await axiosInstance.post("/hunting/query", data);
  return res.data;
}

// 2. Get All Saved Queries (GET)
export async function getAllSavedQueries(params = {}) {
  // params: { page, limit, search, category, sortBy, sortOrder }
  const res = await axiosInstance.get("/hunting/queries", { params });
  return res.data;
}

// 3. Create Saved Query (POST)
export async function createSavedQuery(data) {
  // data: { category, name, esql, kql }
  const res = await axiosInstance.post("/hunting/queries", data);
  return res.data;
}

// 4. Update Saved Query (PUT)
export async function updateSavedQuery(id, data) {
  const res = await axiosInstance.post(`/hunting/queries/${id}`, data);
  return res.data;
}

// 5. Delete Saved Query (DELETE)
export async function deleteSavedQuery(id) {
  const res = await axiosInstance.delete(`/hunting/queries/${id}`);
  return res.data;
}