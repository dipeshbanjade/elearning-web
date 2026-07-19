export const checkValidation = (key: string, val: string) => {
  let message = "";

  if (key === "name") {
    if (val.trim() === "" || val.trim().length <= 3) {
      message = "Name must be greater than 3 characters";
    }
  }

  return message;
};
