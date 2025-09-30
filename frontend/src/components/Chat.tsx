import { useState, useEffect } from "react";
import UserSearch from "./UserSearch";
import { getMessages, sendMessage, editMessage, deleteMessage } from "../api";
import type { User, Message } from "../types";

export default function Chat({ token, currentUserId }: { token: string; currentUserId: number }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>([]); // active chats list

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      const msgs = await getMessages(token, selectedUser.id);
      setMessages(msgs);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedUser, token]);

  const handleSend = async () => {
    if ((!newMessage.trim() && files.length === 0) || !selectedUser) return;
    await sendMessage(token, selectedUser.id, newMessage, files);
    setNewMessage("");
    setFiles([]);
    const updated = await getMessages(token, selectedUser.id);
    setMessages(updated);

    // add to active chats if not already present
    setActiveChats((prev) => {
      if (!prev.find((u) => u.id === selectedUser.id)) {
        return [...prev, selectedUser];
      }
      return prev;
    });
  };

  const handleEdit = async (id: number) => {
    const content = prompt("Write new text:");
    if (content) {
      await editMessage(token, id, content);
      const updated = await getMessages(token, selectedUser!.id);
      setMessages(updated);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete message?")) {
      await deleteMessage(token, id);
      const updated = await getMessages(token, selectedUser!.id);
      setMessages(updated);
    }
  };

  return (
    <div className="flex h-[90vh] bg-gray-100 rounded-lg shadow overflow-hidden">
      {/* Left part */}
      <div className="w-1/3 border-r border-gray-300 flex flex-col">
        <div className="p-3 border-b bg-white">
          <UserSearch token={token} selectUser={setSelectedUser} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeChats.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">No active chats</p>
          ) : (
            activeChats.map((user) => (
              <div
                key={user.id}
                className="p-3 cursor-pointer hover:bg-gray-200 transition rounded-lg"
                onClick={() => setSelectedUser(user)}
              >
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-500">Open to start chat</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right part */}
      <div className="flex-1 flex flex-col">
        {!selectedUser ? (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
            Choose a user to start chatting
          </div>
        ) : (
          <>
            {/* Username of a friend */}
            <div className="p-3 border-b bg-white">
              <h3 className="font-semibold">{selectedUser.username}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from_id === currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-lg ${
                      msg.from_id === currentUserId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p>{msg.content}</p>
                    {msg.attachments?.map((a) => (
                      <div key={a.id}>
                        <a
                          href={`http://localhost:8000${a.url}`}
                          target="_blank"
                          className="underline text-sm"
                        >
                          {a.filename}
                        </a>
                      </div>
                    ))}
                    {msg.from_id === currentUserId && (
                      <div className="flex gap-2 justify-end mt-1 text-xs">
                        <button onClick={() => handleEdit(msg.id)}>✏️</button>
                        <button onClick={() => handleDelete(msg.id)}>❌</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Typing */}
            <div className="p-3 border-t flex items-center gap-2 bg-white">
              <input
                type="file"
                multiple
                className="hidden"
                id="fileInput"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
              <label htmlFor="fileInput" className="cursor-pointer text-xl px-2">
                📎
              </label>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
              >
                ➤
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}