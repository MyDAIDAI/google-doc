"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getUsers() {
  const { sessionClaims } = await auth();
  const clerk = await clerkClient();

  const response = await clerk.users.getUserList({
    organizationId: [sessionClaims?.org_id as string]
  });

  const users = response.data.map((user) => {
    return {
      id: user.id,
      name: user.fullName ?? (user.primaryEmailAddress?.emailAddress ?? "Annoymous"),
      avatar: user.imageUrl
    }
  });

  console.log('users', users);

  return users;
}