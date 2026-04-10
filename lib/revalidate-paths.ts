import { revalidatePath } from "next/cache";

export const APP_CONTENT_PATHS = [
  "/",
  "/home",
  "/profil",
  "/mine-aktiviteter",
  "/meldinger",
  "/instillinger",
] as const;

export function revalidateAppContentPaths(extraPaths: readonly string[] = []) {
  const paths = new Set([...APP_CONTENT_PATHS, ...extraPaths]);

  for (const path of paths) {
    revalidatePath(path);
  }
}
