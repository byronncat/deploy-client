const SHARED_ROUTE = {
  EXPLORE: '/explore',
  PROFILE: '/profile/:username',
  POST: '/post/:id',
};

const PROTECTED_ROUTE = {
  HOME: '/',
};

const PUBLIC_ROUTE = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ...SHARED_ROUTE,
};

const ROUTE = {
  ...PROTECTED_ROUTE,
  ...PUBLIC_ROUTE,
};

export { ROUTE, PROTECTED_ROUTE, PUBLIC_ROUTE };
