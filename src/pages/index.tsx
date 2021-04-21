import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type File = {
  url: string;
  type: string;
  duration: number;
}
type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: File;
}
type HomeProsp = {
  episodes: Episode[];
}

export default function Home(props: HomeProsp) {

    console.log(props.episodes)
  return (
    props.episodes.map(dp=>{
      return (
        <div key={dp.title}>
          <h2>{dp.title}</h2>
          <br />
        </ div>
      )
    })
  )
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
    };
  })

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  }
}