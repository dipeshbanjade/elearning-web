import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Pagination from "../../../component/Pagination";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  isActive?: boolean;
}

interface SubCategoriesListProps {
  data: SubCategory[];
  categories: Category[];
  currentPage: number;
  pageSize: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  onEdit: (subCategory: SubCategory) => void;
  onDelete: (id: string) => void;
}

export default function SubCategoriesList({
  data,
  categories,
  currentPage,
  pageSize,
  totalPage,
  onPageChange,
  onEdit,
  onDelete,
}: SubCategoriesListProps) {
  const categoryNameById = new Map(categories.map((c) => [c._id, c.name]));
  const findSubCategory = (id: string) => data.find((c) => c._id === id);

  const rows = data.map((sub, index) => ({
    id: sub._id,
    sn: (currentPage - 1) * pageSize + index + 1,
    name: sub.name,
    category: categoryNameById.get(sub.categoryId) ?? "-",
    status: sub.isActive,
  }));

  const columns: GridColDef[] = [
    {
      field: "sn",
      headerName: "SN",
      width: 80,
      sortable: false,
      filterable: false,
    },
    {
      field: "category",
      headerName: "Category",
      width: 180,
    },
    {
      field: "name",
      headerName: "Subcategory",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Active" : "Inactive",
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <button
            className="btn btn-warning btn-sm me-2"
            onClick={() => {
              const subCategory = findSubCategory(params.row.id);
              if (subCategory) onEdit(subCategory);
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(params.row.id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="table-responsive">
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter
          checkboxSelection
          showToolbar
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
