export interface Player {
    id: number;
    name: string;
    time: number | null;
    avatar: string;
    score: number | null;
    history: string[];
    articles: Map<string, boolean>;
    dictator: string | null;
    snail: number | null;
}