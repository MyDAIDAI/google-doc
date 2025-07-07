import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";


export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if(!user) {
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.db.insert("documents", {
      title: args.title ?? "Untitled document",
      initialContent: args.initialContent ?? "",
      ownerId: user.subject,
    });

    return document;
  }
});

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});