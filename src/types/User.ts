export type Role = "Tenant" | "Owner" | "Admin";

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};
