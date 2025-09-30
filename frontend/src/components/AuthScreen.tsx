import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import type { User } from "../types";

export default function AuthScreen({ onAuth }: { onAuth: (token: string, user: User) => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="relative flex w-[900px] max-w-full shadow-2xl rounded-xl overflow-hidden">
        {/* Left panel */}
        <div
          className={`flex flex-col items-center justify-center w-1/2 p-8 text-white transition-all duration-500 ${
            tab === "register"
              ? "bg-gradient-to-r from-orange-500 to-red-500"
              : "bg-gradient-to-r from-blue-500 to-indigo-600"
          }`}
        >
          {tab === "register" ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className="mb-6 text-center text-sm opacity-90">
                To keep connected with us please login with your personal info
              </p>
              <button
                onClick={() => setTab("login")}
                className="rounded-full border border-white px-6 py-2 text-sm font-semibold hover:bg-white hover:text-red-500 transition"
              >
                SIGN IN
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
              <p className="mb-6 text-center text-sm opacity-90">
                Enter your details and start your journey with us
              </p>
              <button
                onClick={() => setTab("register")}
                className="rounded-full border border-white px-6 py-2 text-sm font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                SIGN UP
              </button>
            </>
          )}
        </div>

        {/* Right panel */}
        <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
          {tab === "register" ? (
            <div className="w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-6">Create Account</h2>
              <Register onRegister={onAuth} />
            </div>
          ) : (
            <div className="w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-6">Sign In</h2>
              <Login onLogin={onAuth} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
