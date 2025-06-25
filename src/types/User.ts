export type Role = "Tenant" | "Owner" | "Admin";

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
};

export type LoginUser = {
  email: string;
  password: string;
};

export type RegisterUser = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  role: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
