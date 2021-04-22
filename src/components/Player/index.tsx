import Image from 'next/image';
import { useContext } from 'react';
import PlayerContext from '../../contexts/PlayerContext';


import styles from './styles.module.scss';

export default function Player(){

  const { episodeList, currentEpisodeIndex } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];

  return (
    <section className={styles.playerContainer}>
      <header>
        <img src={episode? "/playing.svg":"/playing-not.svg"} alt="Tocando agora" />
        <strong>{episode? "Tocando agora": "Não tocando"}</strong>
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

      <footer className={!episode && styles.empty}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            <div className={styles.emptySlider}></div>
          </div>
          <span>{episode?.durationAsString ?? "00:00"}</span>
        </div>

        <div className={styles.buttons}>
          <button type="button">
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button">
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button className={styles.playButton} type="button">
            <img src="/play.svg" alt="Tocar" />
          </button>
          <button type="button">
            <img src="/play-next.svg" alt="Tocar proxima" />
          </button>
          <button type="button">
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </section>
  );
}