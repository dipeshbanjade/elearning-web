import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Pagination from "../../../component/Pagination";
import type {
  UserRecord,
  UserListProps,
} from "../../../propsInterface/Interface";

export default function TeacherList({
  data,
  currentPage,
  pageSize,
  totalPage,
  onPageChange,
  onEdit,
  onDelete,
}: UserListProps) {
  const rows = data.map((teacher, index) => ({
    id: teacher._id,
    sn: (currentPage - 1) * pageSize + index + 1,
    fullname: teacher.fullname,
    username: teacher.username,
    phoneNo: teacher.phoneNo,
    category: teacher.Category?.[0]?.name ?? "-",
  }));

  const findTeacher = (id: string) => data.find((t) => t._id === id);

  const columns: GridColDef[] = [
    {
      field: "sn",
      headerName: "SN",
      width: 80,
      sortable: false,
      filterable: false,
    },
    {
      field: "fullname",
      headerName: "Full Name",
      flex: 1,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
    },
    {
      field: "phoneNo",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "category",
      headerName: "Category",
      width: 180,
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
              const teacher: UserRecord | undefined = findTeacher(
                params.row.id,
              );
              if (teacher) onEdit(teacher);
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
