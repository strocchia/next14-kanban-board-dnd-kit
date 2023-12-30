import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  dnd_tasks: defineTable({
    // // id: v.optional(v.id("dnd_tasks")),
    // id: v.optional(v.string()),
    content: v.string(),
    columnId: v.string(),
    user: v.optional(v.id("users")),
  }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});
