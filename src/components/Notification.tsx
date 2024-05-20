import back from "../assets/back.svg";
import avatar from "../assets/user.svg";

export interface notificationInterface {
  sender: string | undefined;
  socketIdSender: string | undefined;
  socketIdRecipient: string | undefined;
  text: string | undefined;
}

const Notification = ({
  notification,
  onBackClick,
}: {
  notification: Array<notificationInterface>;
  onBackClick: () => void;
}) => {
  return (
    <div className="absolute top-0 w-full h-full bg-green-950">
      <div className="w-full h-14 flex items-center gap-3 lg:gap-5 bg-green-700 shadow-2xl p-3">
        <button onClick={onBackClick}>
          <img src={back} className="w-6 h-6" alt="kembali" />
        </button>
        <h1 className="sm:text-lg md:text-2xl font-bold">Notifikasi</h1>
      </div>
      <div className="w-full flex flex-col gap-2 divide-y divide-green-800">
        {notification.map((item) => (
          <div
            className="w-full flex flex-col sm:flex-row items-center gap-4 p-3"
            key={"notif-" + item.socketIdSender}
          >
            <img src={avatar} className="w-8 h-8" alt="" />
            <div className="w-full flex flex-col text-center sm:text-left">
              <h1 className="text-lg font-bold">{item.sender}</h1>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
