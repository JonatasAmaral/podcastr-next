import { createContext, useState, ReactNode, useContext} from "react";

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
  isLooping: boolean;
  isShuffle: boolean;
  play: (episode: Episode)=>void;
  playList: (list: Episode[], index: number)=>void;
  playNext: ()=>void;
  playPrevious: ()=>void;
  togglePlay: (forceState?)=>void;
  toggleLoop: ()=>void;
  toggleShuffle: ()=>void;
  clearPlayerState: ()=>void;
}

type PlayerContextProviderProps = {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData)

export default function PlayerContextProvider ({children }:PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

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
    if (isShuffle) {
      const ramdomEpisode = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(ramdomEpisode);
    }
    else setCurrentEpisodeIndex(idx=>idx+1);
  }
  function playPrevious () {
    setCurrentEpisodeIndex(idx=>idx-1);
  }

  function toggleLoop() {
    setIsLooping(looping=>!looping);
  }

  function toggleShuffle() {
    setIsShuffle(random=>!random);
  }

  function clearPlayerState() { 
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }
 
  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isLooping,
      isShuffle,
      play,
      playList,
      playNext,
      playPrevious,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      clearPlayerState,
    }}>

      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = ()=>useContext(PlayerContext)
