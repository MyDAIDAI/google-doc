
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    // name: v.string(),
    title: v.string(),
    // content: v.string(),
    // createdAt: v.number(),
    // updatedAt: v.number(),
    // createdBy: v.id("users"),
    // updatedBy: v.id("users"),
  }),
});