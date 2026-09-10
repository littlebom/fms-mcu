import "server-only";

export {
  listStaffProfiles,
  getStaffProfileById,
  listDepartments,
  upsertDepartment,
  type StaffProfileDto,
  type DepartmentDto,
} from "./_internal/services";
export { STAFF_P, STAFF_PERMISSIONS } from "./permissions";
