import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {

  const [vocabulary, setVocabulary] = useState("")
  const [meaning, setMeaning] = useState("")
  const [myArr, setMyArr] = useState([])
  const [error, setError] = useState("")
  const vocabRef = useRef(0);
  const [loading, setLoading] = useState(true)

  function handleSetVocabulary(e){
    setVocabulary(e.target.value)
  }

  function handleSetMeaning(e){
    setMeaning(e.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(vocabulary==""){
      setError("Please add vocabulary")
      return
    }
    if(meaning==""){
      setError("Please add vocabulary")
      return
    }
    else{
      setMyArr([...myArr, {v: vocabulary, m: meaning,c: 1}])
      setVocabulary("")
      setMeaning("")
      vocabRef.current.focus();
    }
  }

  function handleCount(index){
    let myCount = myArr[index].c + 1
    myArr.forEach(function(part, i) {
        if(i == index){
          part.c = myCount
        }
    });
    setMyArr([...myArr])
  }

  function handleDelete(index){
    myArr.splice(index, 1);
    setMyArr([...myArr])
  }

  useEffect(()=> {
    const url = 'http://localhost:3000/api/getArr';

    axios.get(url).then((response) => {
      setMyArr([...response.data])
    })
    .catch((error) => {
      // handle errors
    });
    
  }, [])

  useEffect(()=>{
    
    async function AddArr(){
      const jsonArr = JSON.stringify(myArr);
      const result = await axios.post('http://localhost:3000/api/updateArr',
      {
        headers: {
        'Content-Type': 'application/json'
        },
        data:{
          jsonArr
        }
    })
    }
    if (loading == false){
      AddArr()
    }
  }, [myArr])

  useEffect(()=>{
    setLoading(false)
  }, [])

  return (
    <>
      <h1 className="flex items-center justify-center text-4xl py-4">
        Woramet Vocabulary
      </h1>
      <div className='flex justify-center'> 
        <form className='flex flex-col items-end justify-between mx-5 gap-2' onSubmit={handleSubmit}>
        <div className='flex gap-2'>
          <label>Enter your Vocabulary:</label>
          <input ref={vocabRef} className='border border-black' type="text" value={vocabulary} onChange={handleSetVocabulary}/>
        </div>
        <div className='flex gap-2'>
          <label>Enter your Meaning:</label>
          <input className='border border-black' type="text" value={meaning} onChange={handleSetMeaning}/>
        </div>
        <button className='border border-black p-3' type='submit'>Submit</button>
      </form>
      </div>
      <div className='mt-5'>
        {myArr.map((item, index) => {
          return <div className='my-3 mx-8  flex items-center justify-between gap-5' key={index}>{myArr[index].v}
          <div>{myArr[index].m}</div>
          <div className='flex items-center justify-center gap-3'>
            <p>{myArr[index].c}</p>
            <button className='border border-black p-2' onClick={() => handleCount(index)}>+</button>
            <button className='border border-black p-2' onClick={() => handleDelete(index)}>Delete</button>
          </div>
          </div>
        })}
      </div>
    </>
  )
}

export default App
