import axios from "axios";
import type { User, Message } from "./types";

const API_URL = "http://localhost:8000"; // FastAPI

export async function registerUser(username: string, email: string, password: string): Promise<{ access_token: string, user: User }> {
    const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    return {
        access_token: res.data.access_token,
        user: res.data.user
    };
}

export async function loginUser(email: string, password: string): Promise<{ access_token: string, user: User }> {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return {
        access_token: res.data.access_token,
        user: res.data.user
    };
}

export async function getUsers(token: string, query: string): Promise<User[]> {
    const res = await axios.get(`${API_URL}/users?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function getCurrentUser(token: string) {
    const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// Get messages with a specific user
export async function getMessages(token: string, userId: number): Promise<Message[]> {
    console.log("Sending token (getMessages):", token);
    const res = await axios.get(`${API_URL}/chat/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// Send message with attachments
export async function sendMessage(token: string, userId: number, content: string, files: File[]): Promise<Message> {
    const formData = new FormData();
    formData.append("receiver_id", userId.toString());
    formData.append("content", content);
    files.forEach(f => formData.append("files", f));

    const res = await axios.post(`${API_URL}/chat/send`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function editMessage(token: string, msgId: number, content: string) {
    const formData = new FormData();
    formData.append("content", content);

    const res = await axios.put(`${API_URL}/chat/messages/${msgId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function deleteMessage(token: string, msgId: number) {
    const res = await axios.delete(`${API_URL}/chat/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}
