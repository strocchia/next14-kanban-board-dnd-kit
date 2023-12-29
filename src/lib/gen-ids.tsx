import { v4 as uuid } from "uuid";

export function generateID_v1() {
  return Math.floor(Math.random() * 100);
}

export function generateID_v2() {
  return uuid({ random: { length: 1 } });
}

export function generateID_v3() {
  return Date.now();
}
