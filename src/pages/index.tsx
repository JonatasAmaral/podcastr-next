import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
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

    // filtrar dados
    const {
      // attrs a remover
      file,

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

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  }
}