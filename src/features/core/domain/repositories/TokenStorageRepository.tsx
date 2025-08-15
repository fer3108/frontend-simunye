export interface TokenStorageRepository {
  saveToken(nameToken: string): void;
  getToken(nameToken: string): string | null;
  removeToken(nameToken: string): void;
}
