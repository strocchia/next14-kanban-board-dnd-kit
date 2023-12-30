import { mutation } from "./_generated/server";
import { v } from "convex/values";

import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("dnd_tasks").collect();
  },
});

export const createTask = mutation({
  args: { content: v.string(), columnId: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("dnd_tasks", {
      content: args.content,
      columnId: args.columnId,
    });

    return taskId;
  },
});

export const updateTask = mutation({
  args: { id: v.id("dnd_tasks"), content: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.patch(args.id, {
      content: args.content,
    });

    return taskId;
  },
});

export const deleteTask = mutation({
  args: { id: v.id("dnd_tasks") },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.delete(args.id);

    return taskId;
  },
});
