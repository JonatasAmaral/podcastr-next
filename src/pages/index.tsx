import { useEffect, useState } from "react"

export default function Home() {
  const [podData, setPodData] = useState([]);
  useEffect(()=>{
    fetch('http://localhost:3333/episodes')
      .then(response=>response.json())
      .then(data=>{
        console.log(data)
        setPodData(data);
      })
  }, [])

  return (
    
    podData.map(dp=>{
      return (
        <>
          <h2>{dp.title}</h2>
          <br />
        </>
      )
    })
  )
}
