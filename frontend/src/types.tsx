export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Message {
    id: number;
    from_id: number;
    from_username: string;
    to_id: number;
    content: string;
    timestamp: string;
    attachments?: Attachment[];
}

export interface Attachment {
    id: number;
    filename: string;
    url: string;
}