import Header from '../components/Header'
import Player from '../components/Player'
import '../styles/globals.scss'
import styles from '../styles/app.module.scss'
import PlayerContext from '../contexts/PlayerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
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
    <div className={styles.wrapper}>
      <PlayerContext.Provider value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        play,
        togglePlay,
      }}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </PlayerContext.Provider>
    </div>
  )
}

export default MyApp
