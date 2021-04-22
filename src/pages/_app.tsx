import Header from '../components/Header'
import Player from '../components/Player'
import '../styles/globals.scss'
import styles from '../styles/app.module.scss'
import PlayerContext from '../contexts/PlayerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(null);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
  }
 
  return (
    <div className={styles.wrapper}>
      <PlayerContext.Provider value={{
        episodeList,
        currentEpisodeIndex,
        play,
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
