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
  playList: (list: Episode[], index: number)=>void;
  playNext: ()=>void;
  playPrevious: ()=>void;
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

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay(forceState) {
    setIsPlaying(playing=>{
      return forceState ?? !playing
    });
  }

  function playNext () {
    setCurrentEpisodeIndex(idx=>idx+1);
  }

  function playPrevious () {
    setCurrentEpisodeIndex(idx=>idx-1);
  }
 
  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      play,
      playList,
      playNext,
      playPrevious,
      togglePlay,
    }}>

      {children}
    </PlayerContext.Provider>
  )
}
