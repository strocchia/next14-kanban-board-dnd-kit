import { v4 as uuid } from "uuid";

export function generateID_v1(length = 5) {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");

  let str = "";
  for (let i = 0; i < length; i++) {
    const random_index = Math.floor(Math.random() * chars.length);
    str += chars[random_index];
  }

  return str;
}

export function generateID_v2() {
  return uuid();
}

export function generateID_v3() {
  return Date.now();
}
