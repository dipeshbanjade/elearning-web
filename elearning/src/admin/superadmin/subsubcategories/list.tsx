import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Pagination from "../../../component/Pagination";

interface SubCategory {
  _id: string;
  name: string;
}

interface SubSubCategory {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  isActive?: boolean;
}

interface SubSubCategoriesListProps {
  data: SubSubCategory[];
  subCategories: SubCategory[];
  currentPage: number;
  pageSize: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  onEdit: (subSubCategory: SubSubCategory) => void;
  onDelete: (id: string) => void;
}

export default function SubSubCategoriesList({
  data,
  subCategories,
  currentPage,
  pageSize,
  totalPage,
  onPageChange,
  onEdit,
  onDelete,
}: SubSubCategoriesListProps) {
  const subCategoryNameById = new Map(subCategories.map((c) => [c._id, c.name]));
  const findSubSubCategory = (id: string) => data.find((c) => c._id === id);

  const rows = data.map((subSub, index) => ({
    id: subSub._id,
    sn: (currentPage - 1) * pageSize + index + 1,
    name: subSub.name,
    subCategory: subCategoryNameById.get(subSub.subCategoryId) ?? "-",
    status: subSub.isActive,
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
      field: "subCategory",
      headerName: "Subcategory",
      width: 180,
    },
    {
      field: "name",
      headerName: "Subsubcategory",
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
              const subSubCategory = findSubSubCategory(params.row.id);
              if (subSubCategory) onEdit(subSubCategory);
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
