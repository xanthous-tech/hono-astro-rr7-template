import { hc } from 'hono/client';

import type { MainAPI } from '@/api';

export const apiUrl = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';

export const apiClient = hc<MainAPI>(`${apiUrl}/api`, {
  init: {
    credentials: 'include',
  },
});
