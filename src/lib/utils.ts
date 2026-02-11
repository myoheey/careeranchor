import { v4 as uuidv4 } from "uuid";

export function generateJoinCode(): string {
  return uuidv4().substring(0, 8).toUpperCase();
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
