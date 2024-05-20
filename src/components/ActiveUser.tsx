import bell from "../assets/bell.svg";
import chat from "../assets/chat.svg";
import avatar from "../assets/user.svg";
import { socket } from "../libs/socket";

export interface userInterface {
  userName: string;
  socketId: string;
}

const ActiveUser = ({
  allUsers,
  onBellClick,
  notifCount,
}: {
  allUsers: Array<userInterface>;
  onBellClick: () => void;
  notifCount: number;
}) => {
  function handleSendNotification(user: userInterface) {
    const currentUserName = allUsers.find(
      (currentUser) => currentUser.socketId === socket.id
    )?.userName;
    const data = {
      sender: currentUserName,
      socketIdSender: socket.id,
      socketIdRecipient: user.socketId,
      text: currentUserName + " ingin chat dengan kamu",
    };

    socket.emit("sendNotification", data);
  }

  return (
    <div className="relative w-full h-full rounded-sm  border-r border-r-black backdrop-blur-3xl shadow-2xl">
      <div className="w-full h-14 flex items-center justify-around  2xl:gap-24 bg-green-700 shadow-2xl p-3">
        <h1 className="sm:text-lg lg:text-2xl font-bold">Simple Chat</h1>
        <button className="relative" onClick={onBellClick}>
          <img src={bell} className="w-6 h-6" alt="" />
          {notifCount > 0 && (
            <span className="absolute -top-2 text-sm rounded-full bg-red-500 px-1.5">
              {notifCount}
            </span>
          )}
        </button>
      </div>
      <div>
        <h4 className="font-bold text-center md:text-left pt-6 pb-3 px-2 md:px-4">
          User Aktif
        </h4>
        <div className="flex flex-col items-center gap-2 divide-y divide-green-800">
          {allUsers.map((user, index) => (
            <div
              className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between px-2 md:px-6 py-1"
              key={"user-" + index}
            >
              <div className="w-2/3 flex flex-col md:flex-row items-center gap-2">
                <img src={avatar} className="w-6 h-6" alt="" />
                <p className="text-center md:text-left">
                  {user.userName}
                  {socket.id === user.socketId && <span> (kamu)</span>}
                </p>
              </div>
              {socket.id !== user.socketId && (
                <button
                  className="flex items-center gap-2 rounded-md bg-green-600 p-1"
                  onClick={() => handleSendNotification(user)}
                >
                  Chat{" "}
                  <img
                    src={chat}
                    className="hidden lg:block w-4 h-4 mr-1"
                    alt="ajak chat"
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveUser;
