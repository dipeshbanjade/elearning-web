import axios from "axios";

class LoginApi {
  baseUrl: string = import.meta.env.VITE_BASEAPI || "http://localhost:8093/api";

  async userLogin(username: string, password: string) {
    try {
      const login = await axios({
        method: "post",
        url: `${this.baseUrl}/login`,
        data: {
          username,
          password,
        },
      });
      return login.data;
    } catch (error: any) {
      return (
        error?.response?.data ?? {
          success: false,
          message: "Login failed. Please try again.",
        }
      );
    }
  }
  async userRegister(data: {
    username: string;
    password: string;
    catId: string;
    confirmPassword: string;
    fullname: string;
  }) {
    console.log("reached");
    const addData = {
      ...data,
      userRole: "user",
      loginStep: 1,
    };
    console.log(addData, "send data");
    try {
      const signUp = await axios({
        url: `${this.baseUrl}/register`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        data: addData,
      });
      console.log("datasend", signUp);
      return signUp.data;
    } catch (error) {
      console.log(error);
    }
  }

  async userLogout(userToken: string) {
    try {
      const logout = await axios({
        method: "post",
        url: `${this.baseUrl}/logout`,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return logout.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getAppData() {
    console.log("reached");
    try {
      const webData = await axios({
        method: "get",
        url: `${this.baseUrl}`,
      });
      console.log("app data", webData?.data);
      return webData?.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchSubCategories(userToken: string) {
    const url = `${this.baseUrl}/subcategores`;
    try {
      const res = await axios({
        method: "get",
        url: url,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("subcategories", res?.data);
      return res?.data;
    } catch (error) {
      console.log(error);
    }
  }

  async saveUserSubcategories(userToken: string, subCategoriesId: string) {
    const url = `${this.baseUrl}/user-subcategores`;
    try {
      const res = await axios({
        method: "post",
        url,
        data: { subCategoriesId },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return res?.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new LoginApi();
