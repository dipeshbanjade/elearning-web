import axios from "axios";
class learnerApi {
  baseUrl: string = import.meta.env.VITE_BASEAPI || "http://localhost:8093/api";
  async fetchLearnerinitData(userToken: string, subjectId: string) {
    const url = this.baseUrl + "/learner/init-data";
    const params = { userToken, subjectId };
    const res = await axios({
      method: "get",
      url: url,
      params,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return res?.data;
  }
}
export default new learnerApi();
