import {Route, Routes} from "react-router-dom"
import Launchpad from "./components/Launchpads"
import Rocket from "./components/Rockets"
import Launch from "./components/Launches"
import Home from "./components/Home"
import Core from "./components/Cores"
import Ship from "./components/Ships"
import Payload from "./components/Payloads"
import List from "./components/List"
import './App.css'


function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/launches/page/:page" element={<List type="launches" />} />
          <Route path="/launches/:id" element={<Launch/>}/>
          <Route path="/launchpads/page/:page" element={<List type="launchpads" />} />
          <Route path="/launchpads/:id" element={<Launchpad/>}/>
          <Route path="/rockets/page/:page" element={<List type="rockets" />} />
          <Route path="/rockets/:id" element={<Rocket/>}/>
          <Route path="/cores/page/:page" element={<List type="cores" />} />
          <Route path="/cores/:id" element={<Core/>}/>
          <Route path="/ships/page/:page" element={<List type="ships" />} />
          <Route path="/ships/:id" element={<Ship/>}/>
          <Route path="/payloads/page/:page" element={<List type="payloads" />} />
          <Route path="/payloads/:id" element={<Payload/>}/>
        </Routes>
       </div>
    </>
  )
}

export default App
