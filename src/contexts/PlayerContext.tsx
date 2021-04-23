import { createContext } from "react";

type Episode = {
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString?: string;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode)=>void;
  togglePlay: (forceState?)=>void;
}

export const PlayerContext = createContext({} as PlayerContextData)

export default PlayerContext;
