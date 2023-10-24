import { type NextPage } from "next";
import { GetUserLeaderboard, ServerError } from "@dubs/common";
import axios from "axios";
import { useQuery } from "react-query";
import cn from "classnames";
import { UpdateStandingsModal, NewPlayerModal } from "../components/modals";

const Index: NextPage = () => {
  const { isLoading, error, data } = useQuery<GetUserLeaderboard["payload"], ServerError>("users", () =>
    axios
      .get<GetUserLeaderboard["payload"]>(`${process.env.NEXT_PUBLIC_API_URL}/users/leaderboard`)
      .then((response) => response.data)
  );

  return (
    <>
      <div className="flex flex-col gap-4 p-12">
        <div className="grid grid-cols-2">
          <h1 className="text-4xl font-bold text-primary">The Spooky 7/11 Dubs Leaderboard</h1>
          <div className="flex items-center justify-end gap-4">
            <button
              className="btn btn-secondary"
              onClick={() => (document.getElementById("newPlayerModal")! as HTMLDialogElement).showModal()}
            >
              New Player
            </button>
            <button
              className="btn btn-primary"
              onClick={() => (document.getElementById("updateStandingsModal")! as HTMLDialogElement).showModal()}
            >
              Update Standings
            </button>
          </div>
        </div>
        {/* <div className="divider" /> */}
        <div className="grid grid-cols-3 mt-6 gap-x-6">
          <div className="overflow-x-auto col-span-2">
            <h2 className="text-2xl font-semibold">Leaderboard</h2>
            <div className="divider"></div>
            {isLoading ? (
              <span className="text-white/50 text-lg">Loading leaderboard data...</span>
            ) : error ? (
              <span className="text-error text-lg">Something went wrong.</span>
            ) : data?.leaderboard.length === 0 ? (
              <span className="text-white/50">No players yet. Add a new player!</span>
            ) : (
              <table className="table table-zebra">
                <thead>
                  <tr className="text-lg">
                    <th>Ranking</th>
                    <th>Name</th>
                    <th>Win Percentage</th>
                    <th>Win / Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.leaderboard.map((user, index) => (
                    <tr
                      key={index}
                      className={cn(
                        { "text-primary": index === 0, "text-secondary": index === 1, "text-accent": index === 2 },
                        "font-semibold text-lg"
                      )}
                    >
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>
                        {user.winPercentage} <span className="text-gray-500">%</span>
                      </td>
                      <td>
                        <span className="text-green-400">{user.wins}</span> <span className="text-gray-500">/</span>{" "}
                        <span className="text-red-400">{user.losses}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">Statistics</h2>
            <div className="divider" />
            {isLoading ? (
              <span className="text-white/50 text-lg">Loading statistics data...</span>
            ) : error ? (
              <span className="text-error text-lg">Something went wrong.</span>
            ) : (
              <div className="stats stats-vertical">
                {data?.stats.map(({ title, value, description }, index) => (
                  <div key={index} className="stat">
                    <div className="stat-title">{title}</div>
                    <div className="stat-value">{value}</div>
                    <div className="stat-desc">{description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <UpdateStandingsModal users={data?.leaderboard.map((user) => ({ id: user.id, username: user.username })) || []} />
      <NewPlayerModal />
    </>
  );
};

export default Index;
