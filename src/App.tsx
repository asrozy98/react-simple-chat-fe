import { useEffect, useState } from "react";
import ActiveUser, { userInterface } from "./components/ActiveUser";
import { ChatRoom } from "./components/ChatRoom";
import Notification, { notificationInterface } from "./components/Notification";
import { socket } from "./libs/socket";

const initialNotifState: Array<notificationInterface> = [];

export default function App() {
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isStart, setIsStart] = useState(false);
  const [users, setUsers] = useState(Array<userInterface>);
  const [notification, setNotification] = useState(initialNotifState);
  const [openNotif, setOpenNotif] = useState(false);

  function onConnect() {
    setIsConnected(true);
    setIsStart(true);
    setOpenNotif(false);
    setNotification([]);
  }

  function onDisconnect() {
    setIsConnected(false);
    setIsStart(false);
    setNotification([]);
    setOpenNotif(false);
    setUsername("");
  }

  function startChat(userName: string) {
    socket.connect();
    socket.emit("newUser", {
      userName,
    });
  }

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("activeUsers", (data) => setUsers(data));

    socket.on("notificationResponse", (data) => {
      const newData = data.filter(
        (item: notificationInterface) => item.socketIdRecipient === socket.id
      );
      setNotification(newData);
    });
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-green-950 backdrop-blur-xl text-white">
      {isConnected && isStart ? (
        <div className="w-full h-full flex rounded-md">
          <div className="relative w-2/6 lg:w-1/5">
            <ActiveUser
              allUsers={users}
              notifCount={notification.length}
              onBellClick={() => setOpenNotif(!openNotif)}
            />
            {openNotif && (
              <Notification
                notification={notification}
                onBackClick={() => setOpenNotif(!openNotif)}
              />
            )}
          </div>
          <div className="w-4/6 lg:w-4/5">
            <ChatRoom
              username={username}
              onLeave={() => {
                socket.disconnect();
                socket.on("disconnect", onDisconnect);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full md:w-2/3 xl:w-1/3 h-fit rounded-md bg-green-800 p-2">
          <h1 className="text-2xl font-bold text-center mb-4">
            Login Simple chat
          </h1>
          <p className="font-bold mb-1">Username</p>
          <div className="w-full flex  gap-2">
            <input
              className="w-2/3 text-black rounded-md p-1"
              placeholder="Masukkan username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              className="w-1/3 rounded-md bg-green-700 px-2 py-1"
              onClick={() => startChat(username)}
            >
              Mulai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
