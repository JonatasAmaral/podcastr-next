import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';


import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export default function Player(){

  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffle,
    playNext,
    playPrevious,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    play,
  } = usePlayer();

  useEffect(() => {
    
    if(!audioRef.current) return;
    
    if(isPlaying) audioRef.current.play();
    else audioRef.current.pause();
    
    return () => {
      // cleanup
    }
  }, [isPlaying])

  function setupProgressListener () {
    const audioPlayer = audioRef.current;
    audioPlayer.currentTime = 0;
    audioPlayer.addEventListener('timeupdate', ()=>{
      setProgress( Math.floor(audioPlayer.currentTime) );
    })
  }

  function handleSeek(amount:number){
    const audioPlayer = audioRef.current;
    audioPlayer.currentTime = amount;
    setProgress(amount);
  }

  function stopPlayer() {
    togglePlay(false);
    setProgress(0);
  }
  function handleFinish(){
    stopPlayer();
    if( isLooping ) {
      setTimeout(()=>{
        play(episode);
      }, 5000)
    }
    else playNext();
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <section className={styles.playerContainer}>
      <header>
        <img
          src={isPlaying ? "/playing.anim.svg" : "/playing-not.svg"}
          alt="Tocando agora"
        />
        <strong>
          {episode
            ? isPlaying
              ? "Tocando"
              : "Não tá tocando"
            : "Não tem nada aqui"}
        </strong>
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

      <footer className={episode ? "" : styles.empty}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: "var(--aqua-green)" }}
                railStyle={{ opacity: 0.333 }}
                handleStyle={{
                  borderColor: "var(--aqua-green)",
                  borderWidth: 4,
                }}

                max={episode?.duration || 0}
                value={progress}
                onChange={handleSeek}
              />
            ) : (
              <div className={styles.emptySlider}></div>
            )}
          </div>
          <span>{episode?.durationAsString ?? "00:00:00"}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => togglePlay(true)}
            onPause={() => togglePlay(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleFinish}
          />
        )}

        <div className={styles.buttons}>
          <button
            className={ isShuffle? styles.isActive : ''}
            type="button"
            disabled={episodeList.length < 3 || isLooping}
            onClick={toggleShuffle}
          >
            {isShuffle ? (
              <img src="/shuffle.svg" alt="Embaralhar" />
            ) : (
              <img src="/shuffle-not.svg" alt="Embaralhar" />
            )}
          </button>
          <button
            type="button"
            disabled={currentEpisodeIndex <= 0}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          {episode && isPlaying ? (
            <button
              className={styles.playButton}
              type="button"
              onClick={() => togglePlay(false)}
            >
              <img src="/pause.svg" alt="Pausar" />
            </button>
          ) : (
            <button
              className={styles.pauseButton}
              type="button"
              onClick={() => togglePlay(true)}
            >
              <img src="/play.svg" alt="Tocar" />
            </button>
          )}

          <button
            type="button"
            disabled={(episodeList.length - 1 - currentEpisodeIndex <= 0) && !isShuffle }
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar proxima" />
          </button>
          <button
            className={ isLooping ? styles.isActive : ''}
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
          >
            {isLooping ? (
              <img src="/repeat-one.svg" alt="Repetir" />
            ) : (
              <img src="/repeat-none.svg" alt="Repetir" />
            )}
          </button>
        </div>
      </footer>
    </section>
  );
}