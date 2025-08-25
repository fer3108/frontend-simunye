import type { UserEntity } from "@/features/users/domain/entities/UserEntity";
import { create } from "zustand";

interface Profile {
  profile: UserEntity | null;
  setProfile: (profile: UserEntity) => void;
}

export const useProfileStore = create<Profile>()((set) => ({
  profile: null,
  setProfile: (profile: UserEntity) => set(() => ({ profile })),
}));
