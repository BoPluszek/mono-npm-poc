import { AuthStore } from "./auth-store";

export interface IRootStore {
  authStore: AuthStore<this>;
  sleepTimeout?: number;
  resetErrorTimeout?: number;
  appSettings: { [name: string]: string };
}
