import type { ApiResponseEntity } from "@/features/core/domain/entities/ApiResponse.entity";

import type { UserRepository } from "../../domain/repositories/UserRepository";
import type { UserEntity } from "../../domain/entities/UserEntity";
import type { RoleEntity } from "../../domain/entities/RoleEntity";
import type { PermissionEntity } from "../../domain/entities/PermissionEntity";
import adapterRoleDtoToApi from "../adapters/adapterRoleDtoToApi";
import type { EditRoleEntity } from "../../domain/entities/EditRoleEntity";
import type { NewRoleEntity } from "../../domain/entities/NewRoleEntity";
import type { NewUserEntity } from "../../domain/entities/NewUserEntity";

export class UserRepositoryImp implements UserRepository {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL_V1;
  }

  public async getProfile(
    token: string
  ): Promise<ApiResponseEntity<UserEntity>> {
    try {
      const url = import.meta.env.VITE_API_URL_V1;

      const response = await fetch(`${url}auth/profile`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 401)
        return { status: "error", message: "Error Inesperado" };

      if (!response.ok && response.status === 401)
        return { status: "fail", message: "No autorizado" };

      const { data } = await response.json();
      console.log(data);

      return {
        status: "success",
        message: "perfil obtenido",
        data,
      };
    } catch (error) {
      console.log(error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  public async getUsers(
    token: string
  ): Promise<ApiResponseEntity<UserEntity[]>> {
    try {
      const url = import.meta.env.VITE_API_URL_V1;
      const response = await fetch(`${url}user`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!response.ok && response.status !== 401)
        return { status: "error", message: "Error Inesperado" };

      if (!response.ok && response.status === 401)
        return { status: "fail", message: "No autorizado" };

      const { data } = await response.json();

      return { status: "success", message: "Usuarios Obtenidos", data };
    } catch (error) {
      console.log("getUsersImp", error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  public async createUser(
    user: NewUserEntity,
    token: string
  ): Promise<ApiResponseEntity> {
    try {
      const req = await fetch(`${this.baseUrl}users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      console.log("createUSer imp", req);

      if (!req.ok && req.status === 401)
        return {
          status: "error",
          message: "No autorizado y/o respuesta no configurada",
        };

      if (!req.ok && req.status !== 401) {
        const jsonReq = await req.json();
        return {
          status: "fail",
          message: jsonReq.message || "Error Inesperado",
        };
      }

      console.log(await req.json());

      return { status: "success", message: "usuario creado" };
    } catch (error: any) {
      console.log("createUsersImp", error);
      return {
        status: "error",
        message: error.message || "Ocurrio un Error",
      };
    }
  }

  public async updateUser(
    user: NewUserEntity,
    token: string
  ): Promise<ApiResponseEntity<NewUserEntity>> {
    try {
      const response = await fetch(`${this.baseUrl}users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok && response.status !== 401)
        return { status: "error", message: "Error Inesperado" };

      if (!response.ok && response.status === 401)
        return { status: "fail", message: "No autorizado" };

      const { data } = await response.json();

      return { status: "success", message: "Usuario actualizado", data };
    } catch (error) {
      console.log("updateUser", error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  public async deleteUser(
    user: UserEntity,
    token: string
  ): Promise<ApiResponseEntity> {
    try {
      const response = await fetch(`${this.baseUrl}users/${user.id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 401)
        return { status: "error", message: "Error Inesperado" };

      if (!response.ok && response.status === 401)
        return { status: "fail", message: "No autorizado" };

      return { status: "success", message: "Usuario eliminado" };
    } catch (error) {
      console.log("deleteUser", error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  public async getPermissions(
    token: string
  ): Promise<ApiResponseEntity<PermissionEntity[]>> {
    try {
      const req = await fetch(`${this.baseUrl}permission`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!req.ok && req.status !== 401)
        return { status: "error", message: "Error Inesperado" };

      if (!req.ok && req.status === 401)
        return { status: "fail", message: "No autorizado" };
      const { data } = await req.json();

      return {
        status: "success",
        message: "Permisos obtenidos",
        data,
      };
    } catch (error) {
      console.log(error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  public async createPermission(
    token: string,
    permission: PermissionEntity
  ): Promise<ApiResponseEntity<PermissionEntity>> {
    try {
      const response = await fetch(`${this.baseUrl}permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(permission),
      });

      if (!response.ok && response.status === 409) {
        return { status: "fail", message: "Nombre de permiso ya existe" };
      }

      if (!response.ok && response.status !== 401) {
        return { status: "error", message: "Error Inesperado" };
      }

      if (!response.ok && response.status === 401)
        return { status: "fail", message: "No autorizado" };

      /* const { data } = await response.json(); */

      return { status: "success", message: "Permiso creado" };
    } catch (error) {
      console.log("createPermission", error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }
  public async updatePermission(
    token: string,
    permission: PermissionEntity
  ): Promise<ApiResponseEntity<PermissionEntity>> {
    try {
      const response = await fetch(
        `${this.baseUrl}permissions/${permission.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(permission),
        }
      );

      if (!response.ok && response.status !== 401)
        return { status: "error", message: "Error Inesperado" };

      if (!response.ok && response.status === 401)
        return { status: "fail", message: "No autorizado" };

      const { data } = await response.json();

      return { status: "success", message: "Permiso actualizado", data };
    } catch (error) {
      console.log("updatePermission", error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  public async deletePermission(
    token: string,
    permission: PermissionEntity
  ): Promise<ApiResponseEntity> {
    try {
      console.log("deletePermissionImp", permission.id);
      const response = await fetch(
        `${this.baseUrl}permissions/${permission.id}`,
        {
          method: "PATCH",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("deletePermissionImp", await response.json());
      if (!response.ok && response.status !== 401)
        return { status: "error", message: "Error Inesperado" };

      if (!response.ok && response.status === 401)
        return { status: "fail", message: "No autorizado" };

      return { status: "success", message: "Permiso eliminado" };
    } catch (error) {
      console.log("deletePermission", error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  public async getRoles(
    token: string
  ): Promise<ApiResponseEntity<RoleEntity[]>> {
    try {
      const req = await fetch(`${this.baseUrl}role`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!req.ok && req.status >= 500)
        return { status: "error", message: "Error Inesperado" };

      if (!req.ok && req.status <= 499) {
        const response = req.json();
        return response;
      }

      const { data } = await req.json();

      return { status: "success", message: "Roles obtenidos", data };
    } catch (error) {
      console.log(error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  public async createRole(
    token: string,
    role: NewRoleEntity
  ): Promise<ApiResponseEntity<NewRoleEntity>> {
    const roleAdapter = adapterRoleDtoToApi(role);

    try {
      const response = await fetch(`${this.baseUrl}roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roleAdapter),
      });

      if (!response.ok && response.status === 409) {
        return { status: "fail", message: "Nombre de rol ya existe" };
      }

      if (!response.ok && response.status !== 401) {
        return { status: "error", message: "Error Inesperado" };
      }

      if (!response.ok && response.status === 401) {
        return { status: "fail", message: "No autorizado" };
      }

      /* const { data } = await response.json(); */

      return { status: "success", message: "Rol creado" };
    } catch (error) {
      console.log("createRole", error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  public async updateRole(
    token: string,
    role: EditRoleEntity
  ): Promise<ApiResponseEntity<EditRoleEntity>> {
    const roleAdapter = adapterRoleDtoToApi(role);

    try {
      const response = await fetch(`${this.baseUrl}roles/${role.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roleAdapter),
      });
      console.log("updateRole1", response);
      if (!response.ok && response.status !== 401) {
        return { status: "error", message: "Error Inesperado" };
      }

      if (!response.ok && response.status === 401) {
        console.log("updateRole2", response);
        console.log("updateRole3", await response.json());
        return { status: "fail", message: "No autorizado" };
      }

      /* const responseJson = await response.json(); */

      /* const { data } = responseJson; */

      return { status: "success", message: "Rol actualizado" /* data */ };
    } catch (error) {
      console.log("updateRole", error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }

  public async deleteRole(
    token: string,
    role: RoleEntity
  ): Promise<ApiResponseEntity<RoleEntity>> {
    try {
      const response = await fetch(`${this.baseUrl}roles/${role.id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 401)
        return { status: "error", message: "Error Inesperado" };

      if (!response.ok && response.status === 401)
        return { status: "fail", message: "No autorizado" };

      return { status: "success", message: "Rol eliminado" };
    } catch (error) {
      console.log("deleteRole", error);
      return { status: "error", message: "Ocurrio un Error" };
    }
  }
}
