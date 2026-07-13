import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  executeHuntingQuery,
  getAllSavedQueries,
  createSavedQuery,
  updateSavedQuery,
  deleteSavedQuery,
} from "../../../services/huntingsLogs.services"

// Hook 1: Execute Query
export function useExecuteQuery() {
  return useMutation({
    mutationFn: executeHuntingQuery,
  });
}

// Hook 2: Get All Saved Queries
export function useSavedQueries(params = {}) {
  return useQuery({
    queryKey: ["savedQueries", params],
    queryFn: () => getAllSavedQueries(params),
    keepPreviousData: true,
  });
}

// Hook 3: Create Saved Query
export function useCreateSavedQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSavedQuery,
    onSuccess: () => {
      queryClient.invalidateQueries(["savedQueries"]);
    },
  });
}

// Hook 4: Update Saved Query
export function useUpdateSavedQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSavedQuery(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["savedQueries"]);
    },
  });
}

// Hook 5: Delete Saved Query
export function useDeleteSavedQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSavedQuery,
    onSuccess: () => {
      queryClient.invalidateQueries(["savedQueries"]);
    },
  });
}