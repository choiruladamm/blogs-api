export const successResponse = (message: string, data?: any) => ({
  message,
  data,
});

export const errorResponse = (
  message: string,
  code?: string,
  errors?: any
) => ({
  message,
  code,
  errors,
});
