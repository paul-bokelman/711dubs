import type { Controller, UpdateUserLeaderboard } from "@dubs/common";
import { StatusCodes } from "http-status-codes";
import { updateUserLeaderboardValidation } from "@dubs/common";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";

const handler: Controller<UpdateUserLeaderboard> = async (req, res) => {
  const { success, error } = formatResponse<UpdateUserLeaderboard>(res);
  try {
    const winner = await prisma.user.findUnique({ where: { username: req.body.winner } });
    const loser = await prisma.user.findUnique({ where: { username: req.body.loser } });
    if (!winner || !loser) return error(StatusCodes.NOT_FOUND, "User not found");

    const updatedWinner = await prisma.user.update({
      where: { username: winner.username },
      data: { wins: winner.wins + 1 },
    });
    const updatedLoser = await prisma.user.update({
      where: { username: loser.username },
      data: { losses: loser.losses + 1 },
    });

    return success(StatusCodes.OK, { winner: updatedWinner, loser: updatedLoser });
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const updateLeaderboard = { handler, schema: updateUserLeaderboardValidation };
