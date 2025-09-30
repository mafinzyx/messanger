import { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen";
import Chat from "./components/Chat";
import type { User } from "./types";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("currentUser");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuth = (token: string, user: User) => {
    setToken(token);
    setCurrentUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  };

  if (!token || !currentUser) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center bg-gray-100 p-4 shadow">
        <p>
          You logged in as: <b>{currentUser.username}</b>
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <Chat token={token} currentUserId={currentUser.id} />
    </div>
  );
}
