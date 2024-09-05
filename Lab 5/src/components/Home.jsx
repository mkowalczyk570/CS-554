import React from 'react';
import spaceXLogo from '../assets/spacex.png'
import {Link, useParams} from "react-router-dom"
function Home() {
  return (
    <div>
      <header className = "header">
          <img src={spaceXLogo} alt={"SpaceX Logo"}/>
          <h1>Welcome to the SpaceX API</h1>
          <p>This website is built using React, and here, you can explore the entirety of the SpaceX database!</p>
          <p>The links below will take you to a list of launches, capsules, rockets, and more!</p>
          <p>If you want a specific item, say launch for example, you can do so! e.g. "https://api.spacexdata.com/v4/launches/id"</p>
          <p>Thank you for visiting, enjoy!</p>
          <Link to="/launches/page/0">Launches</Link>
          <br></br>
          <Link to="/launchpads/page/0">Launchpads</Link>
          <br></br>
          <Link to="/rockets/page/0">Rockets</Link>
          <br></br>
          <Link to="/cores/page/0">Cores</Link>
          <br></br>
          <Link to="/ships/page/0">Ships</Link>
          <br></br>
          <Link to="/payloads/page/0">Payloads</Link>
      </header>
    </div>
  );
}

export default Home;