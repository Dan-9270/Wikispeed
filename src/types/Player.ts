export interface Player {
    id: number;
    name: string;
    time: number | null;
    avatar: string;
    score: number | null;
    history: string[];
}