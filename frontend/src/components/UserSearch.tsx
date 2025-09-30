import { useState, useEffect, useRef } from "react";
import type { User } from "../types";
import { getUsers } from "../api";

interface UserSearchProps {
  token: string;
  selectUser: (user: User) => void;
}

export default function UserSearch({ token, selectUser }: UserSearchProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUsers() {
      if (!isOpen) return;
      const data = await getUsers(token, query);
      setUsers(data);
    }
    fetchUsers();
  }, [token, query, isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Search users"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isOpen && (
        <ul className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg z-10">
          {users.length === 0 ? (
            <li className="px-4 py-2 text-gray-500 text-sm">No users</li>
          ) : (
            users.map((user) => (
              <li
                key={user.id}
                onClick={() => {
                  selectUser(user);
                  setIsOpen(false);
                  setQuery("");
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {user.username}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
