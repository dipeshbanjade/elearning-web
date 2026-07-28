import axios from "axios";
import { getStoredUser } from "../helper/helper";

class learnerApi {
  baseUrl: string = import.meta.env.VITE_BASEAPI || "http://localhost:8093/api";

  private authHeaders() {
    const token = getStoredUser()?.token;
    return { Authorization: `Bearer ${token}` };
  }

  async fetchLearnerinitData(subjectId?: string) {
    const url = this.baseUrl + "/learner/init-data";
    const res = await axios({
      method: "get",
      url,
      params: { subjectId },
      headers: this.authHeaders(),
    });
    return res?.data;
  }
}
export default new learnerApi();
