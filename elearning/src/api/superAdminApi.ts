import axios from "axios";
import { getStoredUser } from "../helper/helper";

interface CreateUserPayload {
  fullname: string;
  username: string;
  password: string;
  confirmPassword: string;
  catId: string;
  subcatId: string;
  subsubCatId?: string;
  userRole: string;
}

interface UpdateUserPayload {
  fullname?: string;
  phoneNo?: string;
  profilePic?: string;
  catId?: string;
  subcatId?: string;
  subsubCatId?: string;
}

class superAdminApi {
  baseUrl: string = import.meta.env.VITE_BASEAPI || "http://localhost:8093/api";

  private authHeaders() {
    const token = getStoredUser()?.token;
    return { Authorization: `Bearer ${token}` };
  }

  async fetchUsersByRole(
    role: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const url = `${this.baseUrl}/fetch-user-by-role/${role}`;
    const res = await axios({
      url: url,
      method: "get",
      params: { page, limit, search },
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  // The controller (createUserFromAdmin) is role-agnostic —
  // pass userRole: "teacher" | "user" to create either kind of account.
  async createUser(data: CreateUserPayload) {
    const url = `${this.baseUrl}/create-user-from-admin`;
    const res = await axios({
      url: url,
      method: "post",
      data: data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async getUser(userId: string) {
    const url = `${this.baseUrl}/edit-user/${userId}`;
    const res = await axios({
      url: url,
      method: "get",
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async updateUser(userId: string, data: UpdateUserPayload) {
    const url = `${this.baseUrl}/update-user/${userId}`;
    const res = await axios({
      url: url,
      method: "patch",
      data: data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async deleteUser(userId: string) {
    const url = `${this.baseUrl}/delete-user/${userId}`;
    const res = await axios({
      url: url,
      method: "delete",
      headers: this.authHeaders(),
    });
    return res?.data;
  }
}

export default new superAdminApi();
