import type { Controller, GetUserLeaderboard } from "@dubs/common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";

const calculateWinPercentage = (wins: number, losses: number) => {
  return Number((wins === 0 && losses === 0 ? 0 : (wins / (wins + losses)) * 100).toFixed(2));
};

const handler: Controller<GetUserLeaderboard> = async (_, res) => {
  const { success } = formatResponse<GetUserLeaderboard>(res);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const d = new Date();
  const currentMonth = months[d.getMonth()];

  try {
    const users = await prisma.user.findMany();

    const leaderboard = users
      .map((user) => ({
        ...user,
        winPercentage: calculateWinPercentage(user.wins, user.losses),
      }))
      .sort((u1, u2) => {
        if (u1.wins === u2.wins) {
          if (u1.winPercentage > u2.winPercentage) return 1;
          return -1;
        }
        if (u1.wins > u2.wins) return 1;
        return -1;
      })
      .reverse();

    const totalGames = users.reduce((acc, user) => acc + user.wins + user.losses, 0);
    const mostGamesPlayed = users.reduce(
      (acc, user) => {
        if (user.wins + user.losses > acc.value) return { value: user.wins + user.losses, username: user.username };
        return acc;
      },
      { value: 0, username: "" }
    );

    const mostWins = users.reduce(
      (acc, user) => {
        if (user.wins > acc.value) return { value: user.wins, username: user.username };
        return acc;
      },
      { value: 0, username: "" }
    );

    const mostLosses = users.reduce(
      (acc, user) => {
        if (user.losses > acc.value) return { value: user.losses, username: user.username };
        return acc;
      },
      { value: 0, username: "" }
    );

    const stats = [
      { title: "Total Scares (Total Games)", value: totalGames / 2, description: "All time" },
      {
        title: "Most Scares (Most Games Played)",
        value: `${mostGamesPlayed.username} - ${mostGamesPlayed.value}`,
        description: `For ${currentMonth}`,
      },
      {
        title: "Most Spooky (Most Wins)",
        value: `${mostWins.username} - ${mostWins.value}`,
        description: `For ${currentMonth}`,
      },
      {
        title: "Least Spooky (Most Losses)",
        value: `${mostLosses.username} - ${mostLosses.value}`,
        description: `For ${currentMonth}`,
      },
    ];

    return success(StatusCodes.OK, { leaderboard, stats });
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const getUserLeaderboard = { handler };
