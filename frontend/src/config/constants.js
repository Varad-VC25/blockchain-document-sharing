export const APP_CONFIG = {
  NAME: "BlockDocs",
  FULL_NAME: "Blockchain Document Sharing Platform",
  VERSION: "1.0.0",
  DESCRIPTION: "Secure hybrid document sharing using Blockchain, IPFS, and Cloud Storage",
  TAGLINE: "Secure. Decentralized. Verified.",
  COPYRIGHT: "2024 BlockDocs. All rights reserved.",
};

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  TIMEOUT: 30000,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "blockdocs_auth_token",
  USER_DATA: "blockdocs_user_data",
  THEME: "blockdocs_theme",
  WALLET_ADDRESS: "blockdocs_wallet_address",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DOCUMENTS: "/documents",
  UPLOAD: "/upload",
  SHARED_WITH_ME: "/shared-with-me",
  CLOUD_STORAGE: "/cloud-storage",
  AUDIT_TRAIL: "/audit-trail",
  PROFILE: "/profile",
  VERIFY: "/verify",
};

export const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};
