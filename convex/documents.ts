import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";


/**
 * Create a new document
 * @param args - The arguments for the mutation
 * @param args.title - The title of the document
 * @param args.initialContent - The initial content of the document
 * @returns The created document
 */
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

    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    const document = await ctx.db.insert("documents", {
      title: args.title ?? "Untitled document",
      initialContent: args.initialContent ?? "",
      ownerId: user.subject,
      organizationId,
    });

    return document;
  }
});

/**
 * Get documents
 * @param args - The arguments for the query
 * @param args.paginationOpts - The pagination options
 * @param args.search - The search query
 * @returns The documents
 */
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

    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    if(search && organizationId) {
      return await ctx.db.query("documents")
        .withSearchIndex("search_title", (q) => 
          q.search("title", search)
          .eq('organizationId', organizationId)
          .eq('ownerId', user.subject)
        )
        .paginate(paginationOpts);
    }

    if(search) {
      return await ctx.db.query("documents")
        .withSearchIndex("search_title", (q) => q.search("title", search).eq('ownerId', user.subject))
        .paginate(paginationOpts);
    }

    if(organizationId) {
      return await ctx.db.query("documents")
        .withIndex("by_organization_id", (q) => q.eq('organizationId', organizationId))
        .paginate(paginationOpts);
    }

    return await ctx.db.query("documents")
      .withIndex("by_owner_id", (q) => q.eq('ownerId', user.subject))
      .paginate(paginationOpts);
  },
});

/**
 * Remove a document by ID
 * @param args - The arguments for the mutation
 * @param args.id - The ID of the document to remove
 * @returns The removed document
 */
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
    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    if(!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = document.organizationId === organizationId;
    if(!isOwner && !isOrganizationMember) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

/**
 * Update a document by ID
 * @param args - The arguments for the mutation
 * @param args.id - The ID of the document to update
 * @param args.title - The new title of the document
 * @returns The updated document
 */
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
    const isOrganizationMember = document.organizationId === user.organization_id;
    if(!isOwner && !isOrganizationMember) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args.id, {
      title: args.title,
    });
  },
});