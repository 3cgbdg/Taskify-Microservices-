export interface Task {
    title: string;
    description: string | null;
    category: string | null;
    status: string;
    taskId: string;
}

export interface AuthType {
    user: User | null;
    isAuthenticated: boolean;

}

export interface User {
    email: string,
    token: string,
    rank: string,
    taskComleted: number,
    friendRequests: string[],
    friends: string[],
}

export interface CommentType {
    from: string,
    to: string,
    info: string,
    commentId: string,
}