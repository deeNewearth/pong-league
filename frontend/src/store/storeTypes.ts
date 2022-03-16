export interface Match {
    winner:Player;
    looser:Player;

    details:MatchDetails;
}

export interface Player{
    phoneNumber? : string; // players are identified by phone number
    name?: string;
    rank?: number;
}

export interface MatchDetails{
    tournament: string;
}