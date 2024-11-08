import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginBodyType, RegisterBodyType } from "@/schema/auth.schema";
import authAction from "@/apis/auth.api";
import { useState } from "react";
import { ErrorType } from "@/types/error.type";

const useAuth = {
  useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (loginDetails: LoginBodyType) =>
        authAction.login(loginDetails),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user-session"],
        });
      },
      onError: (error: ErrorType) => {
        console.error("Error during login:", error);
        throw error;
      },
    });
  },

  useRegisterHead() {
    return useMutation({
      mutationFn: (registerDetails: RegisterBodyType) =>
        authAction.registerHead(registerDetails),
      onError: (error: ErrorType) => {
        console.error("Error during head registration:", error);
        throw error;
      },
    });
  },

  useRegisterUser() {
    return useMutation({
      mutationFn: (registerDetails: RegisterBodyType) =>
        authAction.registerUser(registerDetails),
      onError: (error: ErrorType) => {
        console.error("Error during user registration:", error);
        throw error;
      },
    });
  },

  useLogout() {
    const queryClient = useQueryClient();
    const [logoutError, setLogoutError] = useState<unknown>(null);
    return useMutation({
      mutationFn: async () => {
        try {
          const result = await authAction.logout();
          return result;
        } catch (error) {
          setLogoutError(error);
          console.error("Error during logout:", error);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user-session"],
        });
      },
      onError: (error: ErrorType) => {
        console.error("Error during logout:", error);
        throw error;
      },
    });
  },

  useGetSession() {
    const [sessionError, setSessionError] = useState<unknown>(null);
    return useQuery({
      queryKey: ["user-session"],
      queryFn: async () => {
        try {
          const result = await authAction.getSession();
          return result;
        } catch (error) {
          setSessionError(error);
          console.error("Error during session retrieval:", error);
          throw error;
        }
      },
      retry: 0,
    });
  },
};

export default useAuth;
