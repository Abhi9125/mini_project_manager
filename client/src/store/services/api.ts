import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { Project, Task, User, ApiResponse, AuthResponseData } from '@/types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as RootState).auth.token ||
        (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Project', 'Task', 'User'],
  endpoints: (builder) => ({
    // Auth Endpoints
    register: builder.mutation<ApiResponse<AuthResponseData>, { name: string; email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<ApiResponse<AuthResponseData>, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Project Endpoints
    getProjects: builder.query<ApiResponse<Project[]>, void>({
      query: () => '/projects',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Project' as const, id: _id })),
              { type: 'Project', id: 'LIST' },
            ]
          : [{ type: 'Project', id: 'LIST' }],
    }),
    getProjectById: builder.query<ApiResponse<Project>, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation<ApiResponse<Project>, { title: string; description?: string }>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    updateProject: builder.mutation<ApiResponse<Project>, { id: string; title?: string; description?: string }>({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }, { type: 'Project', id: 'LIST' }],
    }),
    deleteProject: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }, 'Task'],
    }),

    // Task Endpoints
    getTasks: builder.query<
      ApiResponse<Task[]>,
      { projectId: string; status?: string; sortBy?: string; order?: string; search?: string }
    >({
      query: ({ projectId, status, sortBy, order, search }) => {
        const params = new URLSearchParams();
        if (status && status !== 'all') params.append('status', status);
        if (sortBy) params.append('sortBy', sortBy);
        if (order) params.append('order', order);
        if (search) params.append('search', search);

        const queryString = params.toString();
        return `/projects/${projectId}/tasks${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Task' as const, id: _id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    createTask: builder.mutation<
      ApiResponse<Task>,
      { projectId: string; title: string; description?: string; status?: string; dueDate: string }
    >({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/tasks`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }, { type: 'Project', id: 'LIST' }],
    }),
    updateTask: builder.mutation<
      ApiResponse<Task>,
      { id: string; title?: string; description?: string; status?: string; dueDate?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
        { type: 'Project', id: 'LIST' },
      ],
    }),
    deleteTask: builder.mutation<ApiResponse<{ id: string; projectId: string }>, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }, { type: 'Project', id: 'LIST' }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = api;
