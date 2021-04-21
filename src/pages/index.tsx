import { GetStaticProps } from 'next';
import { api } from '../services/api';

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

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
}