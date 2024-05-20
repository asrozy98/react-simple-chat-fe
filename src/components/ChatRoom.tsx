import { useEffect, useRef, useState } from "react";
import bg from "../assets/circuit-board.svg";
import { socket } from "../libs/socket";

export interface messageInterface {
  id: string | number;
  name: string;
  text: string;
}

interface dataInterface {
  data: Array<messageInterface>;
}

const initialMessage: dataInterface = {
  data: [],
};

export function ChatRoom({
  username,
  onLeave,
}: {
  username: string;
  onLeave: () => void;
}) {
  const [messages, setMessages] = useState(initialMessage.data);
  const lastMessageRef = useRef<null | HTMLDivElement>(null);
  const [message, setMessage] = useState("");

  function handleSendMessage() {
    if (message.trim() && username) {
      socket.emit("sentMessage", {
        text: message,
        name: username,
        id: `${socket.id}${Math.random()}`,
      });
    }
    setMessage("");
  }

  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setMessages([...messages, data]);
    });
  }, [socket, messages]);

  useEffect(() => {
    // scroll to bottom
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col pr-1">
      <div className="w-full h-14 flex justify-between items-center bg-green-700 shadow-2xl p-2">
        <h1 className="text-3xl">Chat Publik</h1>
        <button className="rounded-md bg-red-700 p-2" onClick={onLeave}>
          Keluar
        </button>
      </div>

      <div
        className="w-full h-full overflow-scroll rounded-md bg-repeat bg-green-200/40 gap-3 p-2"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {messages &&
          messages.map((message) =>
            message.name === username ? (
              <div
                className="w-1/2 bg-green-600 rounded-xl rounded-br-none px-2 py-1 ml-auto mt-2"
                key={message.id}
              >
                <p className="font-bold">Kamu</p>
                <div className="px-1">
                  <p>{message.text}</p>
                </div>
              </div>
            ) : (
              <div
                className="w-1/2 bg-green-800 rounded-xl rounded-bl-none px-2 py-1 mt-2"
                key={message.id}
              >
                <p className="font-bold">{message.name}</p>
                <div className="px-1">
                  <p>{message.text}</p>
                </div>
              </div>
            )
          )}
        <div ref={lastMessageRef} />
      </div>
      <div className="w-full flex justify-between items-center gap-2 shadow-2xl p-2">
        <input
          className="w-4/6 sm:w-5/6 rounded-md text-black p-2"
          value={message}
          placeholder="Isi pesan"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="w-2/6 sm:w-1/6 rounded-md bg-green-700 p-2"
          onClick={handleSendMessage}
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
