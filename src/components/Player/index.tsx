import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import PlayerContext from '../../contexts/PlayerContext';


import styles from './styles.module.scss';

export default function Player(){

  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
  } = useContext(PlayerContext);

  useEffect(() => {
    
    if(!audioRef.current) return;
    
    if(isPlaying) audioRef.current.play();
    else audioRef.current.pause();
    
    return () => {
      // cleanup
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex];

  return (
    <section className={styles.playerContainer}>
      <header>
        <img src={episode? "/playing.svg":"/playing-not.svg"} alt="Tocando agora" />
        <strong>{episode? "Tocando": "Não tá tocando"}</strong>
      </header>

        {episode ? (
          <div className={styles.playingEpisode}>
            <div className={styles.episodeThumb}>
              <Image
                width={592}
                height={592}
                src={episode.thumbnail}
                alt={`episódio ativo: ${episode.title}`}
                objectFit="cover"
              ></Image>
            </div>

            <div className={styles.episodeInfo}>
              <h2>{episode.title}</h2>
              <span>{episode.members}</span>
            </div>
          </div>
        ) : (
          <div className={styles.episodeThumb}>
            <div className={styles.emptyPlayer}>
              <strong>Selecione um podcast para ouvir</strong>
            </div>
          </div>
        )}

      <footer className={episode? "":styles.empty}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{backgroundColor: 'var(--aqua-green)'}}
                railStyle={{opacity: 0.333}}
                handleStyle={{borderColor: 'var(--aqua-green)', borderWidth: 4}}
              />
            ) : (
              <div className={styles.emptySlider}></div>
            )}
          </div>
          <span>{episode?.durationAsString ?? "00:00"}</span>
        </div>

        { episode && 
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={()=>togglePlay(true)}
            onPause={()=>togglePlay(false)}
          />
        }

        <div className={styles.buttons}>
          <button type="button" disabled={episodeList.length<3}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={currentEpisodeIndex<=0}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          {isPlaying ? (
            <button className={styles.playButton} type="button" onClick={()=>togglePlay(false)} >
              <img src="/pause.svg" alt="Pausar" />
            </button>
          ):(
            <button className={styles.playButton} type="button" onClick={()=>togglePlay(true)} >
              <img src="/play.svg" alt="Tocar"/>
            </button>
          )}

          <button type="button" disabled={(episodeList.length-1)-currentEpisodeIndex<=0}>
            <img src="/play-next.svg" alt="Tocar proxima" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </section>
  );
}