export interface LoginRequest{
    email?: string;
    username?: string;
    password: string;
}

export interface RegisterRequest{
    email: string;
    name: string;
    username: string;
    password: string;
    profilePhoto?: File | null;
}

export interface AuthResponse{
    _id: string;
    name: string;
    email: string;
    username: string;
    profilePhoto?: string;
    token: string;
}
export interface User{
    _id: string;
    name: string;
    email: string;
    username: string;
    profilePhoto?: string;
    token: string;
}