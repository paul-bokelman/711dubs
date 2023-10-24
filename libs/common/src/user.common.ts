import type { User } from "@prisma/client";
import { z } from "zod";

/* -------------------------- GET USER LEADERBOARD -------------------------- */

export interface GetUserLeaderboard {
  args: undefined;
  payload: {
    leaderboard: Array<User & { winPercentage: number }>;
    stats: Array<{ title: string; value: number | string; description: string }>;
  };
}

/* ------------------------------- CREATE USER ------------------------------ */

export interface CreateUser {
  args: z.infer<typeof createUserValidation>;
  payload: User;
}

export const createUserValidation = z.object({
  body: z.object({ username: z.string() }),
});

/* ------------------------------- DELETE USER ------------------------------ */

export interface DeleteUser {
  args: z.infer<typeof deleteUserValidation>;
  payload: undefined;
}

export const deleteUserValidation = z.object({
  body: z.object({ username: z.string() }),
});

/* ------------------------- UPDATE USER LEADERBOARD ------------------------ */

export interface UpdateUserLeaderboard {
  args: z.infer<typeof updateUserLeaderboardValidation>;
  payload: { winner: User; loser: User };
}

export const updateUserLeaderboardValidation = z.object({
  body: z.object({ winner: z.string(), loser: z.string() }),
});
