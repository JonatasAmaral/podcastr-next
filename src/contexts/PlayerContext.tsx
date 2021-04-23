import { createContext, useState, ReactNode} from "react";

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

type PlayerContextProviderProps = {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData)

export default function PlayerContextProvider ({children }:PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode:Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay(forceState) {
    setIsPlaying(playing=>{
      return forceState ?? !playing
    });
  }
 
  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      play,
      togglePlay,
    }}>

      {children}
    </PlayerContext.Provider>
  )
}
