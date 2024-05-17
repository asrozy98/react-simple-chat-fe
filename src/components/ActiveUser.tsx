import avatar from "../assets/user.svg";
import { socket } from "../libs/socket";

export interface userInterface {
  userName: string;
  socketId: string;
}

const ActiveUser = ({ allUsers }: { allUsers: Array<userInterface> }) => {
  return (
    <div className="relative w-full h-full rounded-sm  border-r border-r-black backdrop-blur-3xl shadow-2xl">
      <div className="w-full h-14 flex items-center gap-24 bg-green-700 shadow-2xl p-3">
        <h1 className="text-2xl font-bold">Simple Chat</h1>
      </div>
      <div>
        <h4 className="font-bold pt-6 pb-3 px-4">User Aktif</h4>
        <div className="flex flex-col items-center gap-2 divide-y divide-green-800">
          {allUsers.map((user, index) => (
            <div className="w-full flex items-center gap-2 px-6 py-1">
              <img src={avatar} className="w-6 h-6" alt="" />
              <p key={"user-" + index}>
                {user.userName}
                {socket.id === user.socketId && <span> (kamu)</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveUser;
