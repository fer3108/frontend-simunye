export type NewUserEntity = {
  id: string;
  username: string;
  email: string;
  password?: string;
  /* roles: string[]; */
  roles: string[];
  permissions: string[];
};
