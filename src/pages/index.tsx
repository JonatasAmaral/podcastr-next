export default function Home(props) {
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

export async function getServerSideProps () {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    }
  }
}