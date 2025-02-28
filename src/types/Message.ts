import type { Player } from '../types/Player.ts';

export interface Message{
    player:Player;
    text:string;
}