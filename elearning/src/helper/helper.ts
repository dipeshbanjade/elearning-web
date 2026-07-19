import LoginApi from "../api/login";

const USER_STORAGE_KEY = "user";

// Shape of whatever we get back from login/register and stash in localStorage.
// Fields beyond these vary a bit by endpoint, so extra keys are tolerated.
export interface StoredUser {
  token: string;
  fullname: string;
  userRole: string;
  loginStep: number;
  subCategoryId?: string;
  [key: string]: unknown;
}

export const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    console.log(JSON.parse(raw), "users");
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: StoredUser) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const checkEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const checkPassword = (password: string) => {
  return password.length >= 6 && password.length <= 16;
};

export const storeAppDataInLocalstorage = async (): Promise<any | null> => {
  const cached = localStorage.getItem("sector");
  if (cached) {
    return JSON.parse(cached);
  }
  try {
    const res = await LoginApi.getAppData();
    if (res?.success) {
      localStorage.setItem("sector", JSON.stringify(res.data));
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};
