import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Pagination from "../../../component/Pagination";

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive?: boolean;
}

interface CategoriesListProps {
  data: Category[];
  currentPage: number;
  pageSize: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export default function CategoriesList({
  data,
  currentPage,
  pageSize,
  totalPage,
  onPageChange,
  onEdit,
  onDelete,
}: CategoriesListProps) {
  const rows = data.map((cat, index) => ({
    id: cat._id,
    sn: (currentPage - 1) * pageSize + index + 1,
    name: cat.name,
    status: cat.isActive,
  }));

  const findCategory = (id: string) => data.find((c) => c._id === id);

  const columns: GridColDef[] = [
    {
      field: "sn",
      headerName: "SN",
      width: 80,
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Category",
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
              const category = findCategory(params.row.id);
              if (category) onEdit(category);
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
