import "@testing-library/jest-dom/vitest";
process.env.JWT_SECRET = "test-secret";
export const COOKIE_NAME = "auth_token";
export const MAX_AGE_SECONDS = 60 * 60;
export const TOKEN_EXPIRATION_IN = 3600;