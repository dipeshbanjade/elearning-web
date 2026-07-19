import type { ReactNode } from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  width?: number;
  children: ReactNode;
}

export interface NamedRef {
  _id: string;
  name: string;
}

// Shared shape for both teacher and learner records — the backend's
// fetchAllUserByRole endpoint returns the same projection for either role.
export interface UserRecord {
  _id: string;
  fullname: string;
  username: string;
  phoneNo: string;
  profilePic?: string;
  Category?: NamedRef[];
  SubCategory?: NamedRef[];
  SubSubCategory?: NamedRef[];
}

export interface UserListProps {
  data: UserRecord[];
  currentPage: number;
  pageSize: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  onEdit: (user: UserRecord) => void;
  onDelete: (id: string) => void;
}
