import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import PlayerContext from '../../contexts/PlayerContext';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
  description: string;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({episode}:EpisodeProps) {

  const { play } = useContext(PlayerContext)

  return (
    <div className={styles.episodeWrapper}>
      <section className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            width={1200}
            height={250}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <button type="button">
            <img
              src="/play.svg"
              alt="Tocar episódio"
              onClick={() => play(episode)}
            />
          </button>
        </div>
        <div className={styles.contentContainer}>
          <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationAsString}</span>
          </header>
          <hr />
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: episode.description,
            }}
          />
        </div>
      </section>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async ()=>{

  const {data} = await api.get('/episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode=>({
    params: {
      slug: episode.id
    }
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context)=>{
  const { slug } = context.params;
  const { data } = await api.get(`/episodes/${slug}`)

  const {
    file,
    published_at: publishedAt,
    ...rest

  } = data;
  const episode = {
    ...rest,
    url: file.url,
    duration: Number(file.duration),
    publishedAt: format( parseISO(publishedAt), 'd MMM yy', {locale: ptBR } ),
    durationAsString: convertDurationToTimeString( Number(file.duration) ),
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24 * 360 // 360 dias
  }
}
