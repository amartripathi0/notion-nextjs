import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    parentsDocument: v.optional(v.id("documents")),
  },

  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated!");
    }

    const userId = identity.subject;

    const document = await context.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentsDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated!");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});
export const get = query({
  handler: async (ctx) => {
    const identity = ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated!");
    }

    const documents = await ctx.db.query("documents").collect();

    return documents;
  },
});
