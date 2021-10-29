import axios from 'axios'

async function test() {

  const result = await axios.post("/api/test", {
    data: "test"
  })

  console.log(result)

}

function App() {
  return (
    <div className="App">
      <p>hihihi</p>
      <button onClick={test}>Click me!</button>
    </div>
  );
}

export default App;
