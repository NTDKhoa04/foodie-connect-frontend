import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../lib/http";
import { DishReviews } from "@/types/dish-reviews.type";
import { ReviewBody } from "@/schema/review.schema";
import { Dish } from "@/types/dishes.type";

const useDishReview = {
  useGetDishReview(dishId: string) {
    return useQuery({
      queryFn: async () => {
        return await http
          .get<DishReviews>(`v1/dishes/${dishId}/reviews`)
          .then((res) => res.data);
      },
      queryKey: ["dish-reviews", dishId],
    });
  },

  useGetDishInfo(dishId: string) {
    return useQuery({
      queryFn: async () => {
        return await http
          .get<Dish>(`v1/dishes/${dishId}`)
          .then((res) => res.data);
      },
      queryKey: ["dish-info", dishId],
    });
  },

  useGetDishViewCount(dishId: string) {
    return useQuery({
      queryFn: async () => {
        return await http
          .get(`/v1/dishes/${dishId}/viewers/count`)
          .then((res) => res.data);
      },
      queryKey: ["dish-view-count", dishId],
    });
  },

  useCreateDishReview() {
    const client = useQueryClient();
    return useMutation({
      mutationFn: async (data: { dishId: string; review: ReviewBody }) => {
        const response = await http.post(
          `v1/dishes/${data.dishId}/reviews`,
          data.review,
        );
        return response;
      },
      onSuccess: (variables) => {
        client.invalidateQueries({
          queryKey: ["dish-reviews", variables.data.dishId],
        });
        client.invalidateQueries({
          queryKey: ["dish-info", variables.data.dishId],
        });
      },
    });
  },

  useUpdateDishReview() {
    const client = useQueryClient();
    return useMutation({
      mutationFn: async (data: {
        dishId: string;
        reviewId: string;
        review: ReviewBody;
      }) => {
        const response = await http.put(
          `/v1/dishes/${data.dishId}/reviews/${data.reviewId}`,
          data.review,
        );
        return response;
      },
      onSuccess: (variables) => {
        client.invalidateQueries({
          queryKey: ["dish-reviews", variables.data.dishId],
        });
        client.invalidateQueries({
          queryKey: ["dish-info", variables.data.dishId],
        });
      },
    });
  },

  useDeleteDishReview() {
    const client = useQueryClient();
    return useMutation({
      mutationFn: async (data: { dishId: string; reviewId: string }) => {
        const response = await http.delete(
          `/v1/dishes/${data.dishId}/reviews/${data.reviewId}`,
        );
        return response;
      },
      onSuccess: (variables) => {
        client.invalidateQueries({
          queryKey: ["dish-reviews", variables.data.dishId],
        });
        client.invalidateQueries({
          queryKey: ["dish-info", variables.data.dishId],
        });
      },
    });
  },
};

export default useDishReview;
