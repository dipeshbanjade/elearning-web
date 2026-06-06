export const checkEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const checkPassword = (password: string) => {
  return password.length >= 6 && password.length <= 16;
};
