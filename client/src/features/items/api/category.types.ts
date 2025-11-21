export interface Category{
    name: string;
    _id: string;
    description?: string;
}

export interface categoryResponse{
    success: boolean;
    count: number;
    categories: Category[];
}