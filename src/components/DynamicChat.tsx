import { useSocket } from "@/app/hooks/useSocket";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

interface Message {
  _id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
}

interface Passenger {
  _id: string;
  fullName: string;
}

interface DynamicChatProps {
  rideId: string;
  userId: string;
  isDriver: boolean;
  passengers: Passenger[];
}

const DynamicChat: React.FC<DynamicChatProps> = ({
  rideId,
  userId,
  isDriver,
  passengers,
}) => {
  const { socket, isConnected } = useSocket();
  const [chats, setChats] = useState<{ [key: string]: Message[] }>({});
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("join-ride", rideId);

      const handleNewMessage = (message: Message) => {
        console.log("New message received:", message);
        setChats((prevChats) => {
          const chatKey = isDriver ? message.sender : "driver";
          return {
            ...prevChats,
            [chatKey]: [...(prevChats[chatKey] || []), message],
          };
        });
      };

      socket.on("new-message", handleNewMessage);

      return () => {
        socket.off("new-message", handleNewMessage);
      };
    }
  }, [socket, isConnected, rideId, isDriver]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/ride/${rideId}/messages`);
        const messages: Message[] = response.data;
        const organizedChats = messages.reduce((acc, message) => {
          const chatKey = isDriver
            ? message.sender === userId
              ? message.recipient
              : message.sender
            : "driver";
          if (!acc[chatKey]) acc[chatKey] = [];
          acc[chatKey].push(message);
          return acc;
        }, {} as { [key: string]: Message[] });
        setChats(organizedChats);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [rideId, isDriver, userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats, selectedChat]);

  const sendMessage = async () => {
    if (inputMessage.trim() && socket && isConnected && selectedChat) {
      setIsSending(true);
      const messageData = {
        sender: userId,
        recipient: isDriver ? selectedChat : "driver",
        content: inputMessage,
        timestamp: new Date(),
      };
      try {
        await socket.emit("send-message", { rideId, message: messageData });
        console.log("Message sent:", messageData);
        setChats((prevChats) => ({
          ...prevChats,
          [selectedChat]: [
            ...(prevChats[selectedChat] || []),
            messageData as Message,
          ],
        }));
        setInputMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!socket || !isConnected) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
        <span className="ml-3 text-gray-600">Connecting to chat...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="w-1/4 border-r">
        <div className="p-4 bg-gray-100 font-semibold">
          {isDriver ? "Passengers" : "Chat with"}
        </div>
        {isDriver ? (
          passengers.map((passenger) => (
            <div
              key={passenger._id}
              onClick={() => setSelectedChat(passenger._id)}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                selectedChat === passenger._id ? "bg-blue-100" : ""
              }`}
            >
              {passenger.fullName}
            </div>
          ))
        ) : (
          <div
            onClick={() => setSelectedChat("driver")}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              selectedChat === "driver" ? "bg-blue-100" : ""
            }`}
          >
            Driver
          </div>
        )}
      </div>
      <div className="w-3/4 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 bg-gray-100 font-semibold">
              {isDriver
                ? passengers.find((p) => p._id === selectedChat)?.fullName
                : "Driver"}
            </div>
            <div
              ref={chatContainerRef}
              className="flex-grow overflow-y-auto p-4 space-y-4"
            >
              {chats[selectedChat]?.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`flex ${
                    msg.sender === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === userId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  disabled={isSending || !inputMessage.trim()}
                  className={`bg-blue-500 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSending || !inputMessage.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
                >
                  {isSending ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicChat;
