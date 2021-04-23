import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './Home.module.scss';
import { PlayerContext } from '../contexts/PlayerContext';
import { useContext } from 'react';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
}
type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export function PlayButton ({episodeList, index, playList}) {
  return (
    <button className={styles.playButton} type="button">
      <img
        src="/play.svg"
        alt="Tocar episódio"
        onClick={() => playList(episodeList, index)}
      />
    </button>
  )
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  const { playList } = useContext(PlayerContext);

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => (
            <li key={episode.id}>
              <Image
                width={3 * 64} // 3x maior p/ telas alta resolução
                height={3 * 64}
                objectFit="cover"
                src={episode.thumbnail}
                alt={episode.title}
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episode/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <PlayButton episodeList={episodeList} index={index} playList={playList} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os Episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td
                  style={{
                    width: 72,
                  }}
                >
                  <Image
                    width={64 * 2}
                    height={64 * 2}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>

                <td>
                  {" "}
                  <Link href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>{" "}
                </td>
                <td> {episode.members} </td>
                <td
                  style={{
                    width: 100,
                  }}
                >
                  {" "}
                  {episode.publishedAt}{" "}
                </td>
                <td> {episode.durationAsString} </td>

                <td>
                  <PlayButton episodeList={episodeList} index={index+latestEpisodes.length} playList={playList} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps:GetStaticProps = async () => {
  const {data} = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode=>{

    // filtrar dados
    const {
      // attrs a remover
      file,
      description,

      // a renomear
      published_at: publishedAt,

      // manter
      ...rest

    } = episode;

    // tratar/manipular e adicionar dados
    return {
      ...rest,
      url: file.url,
      duration: Number(file.duration),
      publishedAt: format( parseISO(publishedAt), 'd MMM yy', {locale: ptBR } ),
      durationAsString: convertDurationToTimeString( Number(file.duration) ),
    }
    
    /*
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.title,
      description: episode.description,
      url: episode.file.url,

      publishedAt: format( parseISO(episode.published_at), 'd MMM yy', {locale: ptBR } ),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString( Number(episode.file.duration) ),
    };*/
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}