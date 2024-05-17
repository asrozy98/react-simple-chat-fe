import { useEffect, useState } from "react";
import ActiveUser, { userInterface } from "./components/ActiveUser";
import { ChatRoom } from "./components/ChatRoom";
import { socket } from "./libs/socket";

export default function App() {
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isStart, setIsStart] = useState(false);
  const [users, setUsers] = useState(Array<userInterface>);

  function onConnect() {
    setIsConnected(true);
    setIsStart(true);
  }

  function onDisconnect() {
    setIsConnected(false);
    setIsStart(false);
    setUsername("");
  }

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("activeUsers", (data) => {
      setUsers(data);
    });
  }, []);

  function startChat(userName: string) {
    socket.connect();
    socket.emit("newUser", {
      userName,
    });
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-green-950 backdrop-blur-xl text-white">
      {isConnected && isStart ? (
        <div className="w-full h-full flex rounded-md">
          <div className="w-1/5">
            <ActiveUser allUsers={users} />
          </div>
          <div className="w-4/5">
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
        <div className="w-1/3 h-fit rounded-md bg-green-800 p-2">
          <h1 className="text-2xl font-bold">Welcome To Simple chat</h1>
          <p>Set Your Username</p>
          <input
            className="text-black"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="rounded-md bg-green-700 p-2"
            onClick={() => startChat(username)}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
