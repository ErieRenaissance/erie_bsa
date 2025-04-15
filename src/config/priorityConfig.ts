// src/config/priorityConfig.ts

export const priorityConfig: Record<string, { className: string }> = {
  todo: {
    className: 'bg-yellow-100 text-yellow-800',
  },
  in_progress: {
    className: 'bg-blue-100 text-blue-800',
  },
  done: {
    className: 'bg-green-100 text-green-800',
  },
};
