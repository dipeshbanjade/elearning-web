import axios from "axios";

class LoginApi {
  // Use Vite env var: create a file named `.env` with `VITE_BASEAPI=...`
  // and access it via `import.meta.env.VITE_BASEAPI` in the client.
  baseUrl: string = import.meta.env.VITE_BASEAPI || "";
  async userLogin(username: string, password: string) {
    try {
      const login = await axios({
        method: "post",
        url: `${this.baseUrl}/auth/login`,
        data: {
          username,
          password,
        },
      });
      return login.data;
    } catch (error) {
      console.log(error);
    }
  }

  async userRegister(data: {
    username: string;
    password: string;
    sector: string;
  }) {
    try {
      const signUp = await axios({
        url: `${this.baseUrl}/auth/signup`,
        method: "post",
        data,
      });
      return signUp.data;
    } catch (error) {
      console.log(error);
    }
  }

  async userLogout(userToken: string) {
    try {
      const logout = await axios({
        method: "post",
        url: `${this.baseUrl}/auth/logout`,
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
    try {
      const webData = await axios({
        method: "get",
        url: `${this.baseUrl}/`,
      });
      return webData?.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new LoginApi();
