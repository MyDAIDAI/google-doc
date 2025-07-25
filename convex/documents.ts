import { paginationOptsValidator } from "convex/server";
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

// export const get = query({
//   handler: async (ctx) => {
//     return await ctx.db.query("documents").collect();
//   },
// });

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, { paginationOpts, search }) => {
    const user = await ctx.auth.getUserIdentity(); 

    if(!user) {
      throw new ConvexError("Unauthorized");
    }

    if(search) {
      return await ctx.db.query("documents")
        .withSearchIndex("search_title", (q) => q.search("title", search).eq('ownerId', user.subject))
        .paginate(paginationOpts);
    }

    return await ctx.db.query("documents")
      .withIndex("by_owner_id", (q) => q.eq('ownerId', user.subject))
      .paginate(paginationOpts);
  },
});

export const removeById = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if(!user) {
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.db.get(args.id);

    if(!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    if(!isOwner) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

export const updateById = mutation({
  args: {
    id: v.id("documents"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if(!user) {
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.db.get(args.id);

    if(!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    if(!isOwner) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args.id, {
      title: args.title,
    });
  },
});