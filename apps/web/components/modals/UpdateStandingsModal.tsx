import type { User } from "@prisma/client";
import type { UpdateUserLeaderboard, ServerError } from "@dubs/common";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-hot-toast";

interface Props {
  users: Array<Pick<User, "id" | "username">>;
}

export const UpdateStandingsModal: React.FC<Props> = ({ users }) => {
  const queryClient = useQueryClient(); // should only happen once...
  const [winner, setWinner] = useState<string | undefined>(undefined);
  const [loser, setLoser] = useState<string | undefined>(undefined);
  const { isLoading, error, data, mutateAsync } = useMutation<
    UpdateUserLeaderboard["payload"],
    ServerError,
    UpdateUserLeaderboard["args"]
  >(
    "updateUserLeaderboard",
    ({ body }) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/updateLeaderboard`, body).then((response) => response.data),
    {
      onError: () => {
        toast.error("Something went wrong! Please try again later.");
      },
      onSuccess: () => queryClient.invalidateQueries(["users"]),
    }
  );

  const closeModal = () => (document.getElementById("updateStandingsModal")! as HTMLDialogElement).close();

  const handleSubmission = async () => {
    if (isLoading) return;
    if (!winner || !loser) return toast.error("Please fill out both fields");
    if (winner === loser) return toast.error("You can't play yourself! Please choose two different players.");

    try {
      await mutateAsync({ body: { winner, loser } });
      setWinner(undefined);
      setLoser(undefined);
      toast.success("Updated leaderboard!");
      closeModal();
      // toast
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <dialog id="updateStandingsModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Update Leaderboard</h3>
        <p className="py-4 opacity-60 text-sm">Update the standings by choosing who just lost to who.</p>
        <div className="flex items-center gap-2 font-semibold">
          <select
            className="select select-bordered w-full max-w-full bg-neutral/20"
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
          >
            <option disabled selected={winner === undefined}>
              Player name
            </option>
            {users.map((user) => (
              <option key={user.id}>{user.username}</option>
            ))}
          </select>
          <div className="divider">beat</div>

          <select
            className="select select-bordered w-full max-w-full bg-neutral/20"
            value={loser}
            onChange={(e) => setLoser(e.target.value)}
          >
            <option disabled selected={loser === undefined}>
              Player name
            </option>
            {users.map((user) => (
              <option key={user.id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div className="modal-action">
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={async () => handleSubmission()}>
              {" "}
              {isLoading && <span className="loading loading-spinner"></span>}
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};
