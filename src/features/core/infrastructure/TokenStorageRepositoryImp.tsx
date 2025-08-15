import type { TokenStorageRepository } from "../domain/repositories/TokenStorageRepository";

export class TokenStorageRepositoryImp implements TokenStorageRepository {
  saveToken(nameToken: string): void {
    return localStorage.setItem("token", nameToken);
  }

  getToken(nameToken: string): string | null {
    return localStorage.getItem(nameToken);
  }

  removeToken(nameToken: string): void {
    return localStorage.removeItem(nameToken);
  }
}
