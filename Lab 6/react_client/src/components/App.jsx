import React from "react";
import './App.css'
import { NavLink, Route, Routes } from "react-router-dom";
import Home from './Home';
import Album from "./Album";
import Albums from './Albums'
import Artist from "./Artist";
import Artists from "./Artists";
import Companies from "./Companies";
import Company from "./Company";
import Search from "./Search";
function App(){
    return(
        <div>
            <header className='App-header'>
                <h1 className="App-title center">
                    DbIM Web App
                </h1>
                <nav className="center">
                    <NavLink className='navlink' to='/'>
                        Home
                    </NavLink>
                    <NavLink className='navlink' to='/artists'>
                        Artists
                    </NavLink>
                    <NavLink className='navlink' to='/albums'>
                        Albums
                    </NavLink>
                    <NavLink className='navlink' to='/companies'>
                        Record Companies
                    </NavLink>
                    <NavLink className='navlink' to='/search'>
                        Search
                    </NavLink>
                </nav>
            </header>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/albums/' element={<Albums />} />
                <Route path='/artists/' element={<Artists />} />
                <Route path='/companies/' element={<Companies />} />
                <Route path='/albums/:id' element={<Album />}/>
                <Route path='/artists/:id' element={<Artist />}/>
                <Route path='/companies/:id' element={<Company />}/>
                <Route path='/search/' element={<Search />}/>
            </Routes>
        </div>
    )
}

export default App