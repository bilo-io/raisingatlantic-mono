'use client';

import type { User } from '@/types/models';
import { apiClient, createResourceHooks } from '@/lib/api';

export const usersResource = createResourceHooks<User, void, Partial<User>, Partial<User>>({
  resource: 'users',
  baseUrl: '/users',
  client: apiClient,
  copy: {
    create: { success: 'User created' },
    update: { success: 'User updated' },
    delete: { success: 'User deleted' },
  },
});

export const {
  keys: userKeys,
  useList: useUsers,
  useGet: useUser,
  useCreate: useCreateUser,
  useUpdate: useUpdateUser,
  useDelete: useDeleteUser,
} = usersResource;

/** Public clinician directory list — read-only, separate endpoint. */
export { usersResource as _usersResource };
