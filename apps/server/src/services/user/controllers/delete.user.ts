import type { Controller, DeleteUser } from "@dubs/common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";

const handler: Controller<DeleteUser> = async (req, res) => {
  const { success } = formatResponse<DeleteUser>(res);
  try {
    await prisma.user.delete({ where: { username: req.body.username } });
    return success(StatusCodes.OK);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const deleteUser = { handler };
