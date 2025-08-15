"use server";

import { ConvexHttpClient } from "convex/browser";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<"documents">[]) {
  return await convex.query(api.documents.getByIds, { ids });
}

interface SessionClaims {
  o: {
    id: string;
  }
}

export async function getUsers() {
  const { sessionClaims} = await auth();
  const clerk = await clerkClient();

  const response = await clerk.users.getUserList({
    organizationId: [(sessionClaims as SessionClaims)?.o?.id],
  });

  const users = response.data.map((user) => {
    return {
      id: user.id,
      name: user.fullName ?? (user.primaryEmailAddress?.emailAddress ?? "Annoymous"),
      avatar: user.imageUrl,
      color: '',
    }
  });

  return users;
}