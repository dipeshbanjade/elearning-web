import axios from "axios";
import { getStoredUser } from "../../helper/helper";

interface CategoryPayload {
  name: string;
  description: string;
}

interface SubCategoryPayload {
  name: string;
  description: string;
  categoryId: string;
}

interface SubSubCategoryPayload {
  name: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
}

class superAdminRoute {
  baseUrl: string = import.meta.env.VITE_BASEAPI || "http://localhost:8093/api";
  userToken: string | undefined;

  constructor() {
    this.userToken = getStoredUser()?.token;
  }

  private authHeaders() {
    return { Authorization: `Bearer ${this.userToken}` };
  }

  async getAllCategories(page: number, limit: number, search?: string) {
    const url = this.baseUrl + `/admin/categories`;
    const res = await axios({
      url: url,
      method: "get",
      params: { page, limit, search },
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  // Unpaginated categories + subcategories + subsubcategories in one call,
  // for cascading selects like the teacher/learner creation form.
  async getCategoryTree() {
    const url = this.baseUrl + `/admin/category-tree`;
    const res = await axios({
      url: url,
      method: "get",
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async saveCategories(data: CategoryPayload) {
    const url = this.baseUrl + `/admin/save-category`;
    const saveCat = await axios({
      method: "post",
      url: url,
      data: data,
      headers: this.authHeaders(),
    });
    return saveCat?.data;
  }

  async editCategories(updateId: string, data: Partial<CategoryPayload>) {
    const url = this.baseUrl + `/admin/categories/${updateId}`;
    const res = await axios({
      method: "patch",
      url: url,
      data: data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async deleteCategory(id: string) {
    const url = this.baseUrl + `/admin/categories/${id}`;
    const res = await axios({
      method: "delete",
      url: url,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async getAllSubCategories(page: number, limit: number, search?: string) {
    const url = this.baseUrl + `/admin/subcategories`;
    const res = await axios({
      url: url,
      method: "get",
      params: { page, limit, search },
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async saveSubCategories(data: SubCategoryPayload) {
    const url = this.baseUrl + `/admin/save-subcategory`;
    const res = await axios({
      method: "post",
      url: url,
      data: data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async editSubCategory(updateId: string, data: Partial<SubCategoryPayload>) {
    const url = this.baseUrl + `/admin/subcategories/${updateId}`;
    const res = await axios({
      method: "patch",
      url: url,
      data: data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async deleteSubCategory(id: string) {
    const url = this.baseUrl + `/admin/subcategories/${id}`;
    const res = await axios({
      method: "delete",
      url: url,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async getAllSubSubCategories(page: number, limit: number, search?: string) {
    const url = this.baseUrl + `/admin/subsubcategories`;
    const res = await axios({
      url: url,
      method: "get",
      params: { page, limit, search },
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async saveSubSubCategories(data: SubSubCategoryPayload) {
    const url = this.baseUrl + `/admin/save-subsubcategory`;
    const res = await axios({
      method: "post",
      url: url,
      data: data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async editSubSubCategory(
    updateId: string,
    data: Partial<SubSubCategoryPayload>,
  ) {
    const url = this.baseUrl + `/admin/subsubcategories/${updateId}`;
    const res = await axios({
      method: "patch",
      url: url,
      data: data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async deleteSubSubCategory(id: string) {
    const url = this.baseUrl + `/admin/subsubcategories/${id}`;
    const res = await axios({
      method: "delete",
      url: url,
      headers: this.authHeaders(),
    });
    return res?.data;
  }
}
export default new superAdminRoute();
