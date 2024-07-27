import dynamic from "next/dynamic";

const DynamicChat = dynamic(() => import("./DynamicChat"), { ssr: false });

interface ChatProps {
  rideId: string;
  userId: string;
}

const Chat: React.FC<ChatProps> = ({ rideId, userId }) => {
  return <DynamicChat rideId={rideId} userId={userId} />;
};

export default Chat;
