import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import authService from '../services/auth-service';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';
import { useAuthStore } from '../stores/useAuthStore';
import { UserRole } from '..';

export const useLogin = () => {
  const { login } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data.username, data.password),
    onSuccess: (data) => {
      login(
        {
          ...data.user,
          role: UserRole.ADMIN,
        },
        data.accessToken,
        data.refreshToken
      );
    },
  });

  return {
    loginMutation,
  };
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
    },
  });

  return {
    logoutMutation,
  };
};

export const useRegister = () => {
  const { login } = useAuthStore();
  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: (data) => {
      login(
        {
          ...data.user,
          role: UserRole.ADMIN,
        },
        data.accessToken,
        data.refreshToken
      );
    },
  });

  return {
    registerMutation,
  };
};

export const useGetCurrentUser = () => {
  const { updateUser } = useAuthStore();

  const getCurrentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
  });

  useEffect(() => {
    if (getCurrentUserQuery.data) {
      updateUser({
        ...getCurrentUserQuery.data,
        role: UserRole.ADMIN,
      });
    }
  }, [getCurrentUserQuery.data, updateUser]);

  return {
    getCurrentUserQuery,
  };
};
