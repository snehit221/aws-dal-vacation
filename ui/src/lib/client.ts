import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0 },
  },
  queryCache: new QueryCache({
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(JSON.stringify(error.response?.data));
        return;
      }
      toast.error(error.message);
    },
  }),
  mutationCache: new MutationCache({
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
        return;
      }
      toast.error(error.message);
    },
  }),
});

export const ax = axios.create();
