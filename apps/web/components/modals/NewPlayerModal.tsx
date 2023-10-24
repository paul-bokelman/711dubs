import { useState } from "react";
import type { CreateUser, ServerError } from "@dubs/common";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-hot-toast";

interface Props {}

export const NewPlayerModal: React.FC<Props> = () => {
  const queryClient = useQueryClient(); // should only happen once...
  const [username, setUsername] = useState<string>("");

  const { isLoading, mutateAsync } = useMutation<CreateUser["payload"], ServerError, CreateUser["args"]>(
    "createUser",
    ({ body }) => axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/create`, body).then((response) => response.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
      },
      onError: () => {
        toast.error("Something went wrong! Please try again later.");
      },
    }
  );

  const closeModal = () => (document.getElementById("newPlayerModal")! as HTMLDialogElement).close();

  const handleSubmission = async () => {
    if (isLoading) return;
    if (!username) return toast.error("Please enter a username!");

    try {
      await mutateAsync({ body: { username } });
      setUsername("");
      toast.success("Successfully added new player!");
      closeModal();
      // toast
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <dialog id="newPlayerModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add a new player</h3>
        <p className="py-4 opacity-60 text-sm">Enter your name and click submit!</p>

        <input
          type="text"
          placeholder="First name & last initial"
          className="input input-bordered w-full max-w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="modal-action">
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={async () => handleSubmission()}>
              {isLoading && <span className="loading loading-spinner"></span>}
              {isLoading ? "Adding player..." : "Add Player"}
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
