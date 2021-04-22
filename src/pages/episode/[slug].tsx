import { useRouter } from 'next/router';

export default function Episode() {
  const router = useRouter();

  return(
    <h1>Episodio: {router.query.slug}</h1>
  )
}
