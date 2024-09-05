import '../App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import noImage from '../assets/download.jpeg';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader
} from '@mui/material';


const Launches = () => {
  const [launchData, setLaunchData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  let {id} = useParams();

 
  useEffect(() => {
    console.log('Launch useEffect fired');
    async function fetchData() {
      try {
        const {data: launch} = await axios.get(
          `https://api.spacexdata.com/v4/launches/${id}`
        );
        setLaunchData(launch);
        setLoading(false);
        console.log(launch);
      } catch (e) {
        setStatus(true)
        setLoading(false)
        console.log(e);
      }
    }
    fetchData();
  }, [id]);
  
  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if(status){
    return(
    <div>
        <h2>Error 404: No launch with that id found</h2>
        <Link to="launches/page/0">All launches</Link>
        <br></br>
        <Link to="/">Home</Link>
    </div>)
  } 
  else {
    let embedId = ""
    if(launchData.links.webcast){
      let link = launchData.links.webcast.split("=")
      embedId = link[1]
    }
    return (
      <Card
        variant='outlined'
        sx={{
          maxWidth: 550,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 5,
          border: '1px solid #1e8678',
          boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
        }}
      >
        <CardHeader
          title={launchData.name}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            launchData && launchData.links && launchData.links.patch && launchData.links.patch.large
              ? launchData.links.patch.large
              : noImage
          }
          title='Launch Patch'
        />

        <CardContent>
          <Typography
            variant='body2'
            color='textSecondary'
            component='span'
            sx={{
              borderBottom: '1px solid #1e8678',
              fontWeight: 'bold'
            }}
          >
            <h1>General Information</h1>
            <dl className='content'>
                <p>
                    <dt className="title">Name:</dt>
                    {launchData && launchData.name ? (
                        <dd>{launchData.name}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Flight Number:</dt>
                    {launchData && launchData.flight_number ? (
                        <dd>{launchData.flight_number}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Fire Date:</dt>
                    {launchData && launchData.static_fire_date_utc ? (
                        <dd>{launchData.static_fire_date_utc}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Details:</dt>
                    {launchData && launchData.details ? (
                        <dd>{launchData.details}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Status:</dt>
                    {launchData && launchData.success ? (
                        <dd>Success</dd>
                    ) : (
                        <dd>Failed</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Reused:</dt>
                    {launchData && launchData.fairings && launchData.fairings.reused  ? (
                        <dd>Yes</dd>
                    ) : (
                        <dd>No</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Recovery Attempt:</dt>
                    {launchData && launchData.fairings && launchData.fairings.recovery_attempt  ? (
                        <dd>Yes</dd>
                    ) : (
                        <dd>No</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Recovery Status:</dt>
                    {launchData && launchData.fairings && launchData.fairings.recovered  ? (
                        <dd>Success</dd>
                    ) : (
                        <dd>Failed</dd>
                    )}
                </p>
                <h1>Explore</h1>
                <p>
                    <dt className="title">Webcast:</dt>
                    {launchData && launchData.links && launchData.links.webcast ? (
                        <dd>
                          <iframe
                            width="400"
                            height="480"
                            src={`https://www.youtube.com/embed/${embedId}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Embedded youtube"
                          />
                        </dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Article:</dt>
                    {launchData && launchData.links && launchData.links.article ? (
                        <dd><a href = {launchData.links.article}>Read</a></dd>
                    ) : (
                        <dd>Failed</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Wikipedia:</dt>
                    {launchData && launchData.links && launchData.links.wikipedia ? (
                        <dd><a href = {launchData.links.wikipedia}>Read</a></dd>
                    ) : (
                        <dd>Failed</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Rocket:</dt>
                    {launchData && launchData.rocket ? (
                        <dd>
                          <Link to ={`/rockets/${launchData.rocket}`}>
                            {launchData.rocket}
                          </Link></dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Launchpad:</dt>
                    {launchData && launchData.launchpad ? (
                        <dd>
                          <Link to ={`/launchpads/${launchData.launchpad}`}>
                            {launchData.launchpad}
                          </Link></dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                
                <dt className="title">Ships:</dt>
                    {launchData && launchData.ships && launchData.ships.length > 0 ? (
                        <ol>
                          {launchData.ships.map((ship, index)=> (
                            <li key={index}>
                              <Link to ={`/ships/${ship}`}>
                                {ship}
                              </Link>
                            </li>
                          ))}
                        </ol>
                    ) : (
                        <dd>N/A</dd>
                    )}
                
                
                    <dt className="title">Payloads:</dt>
                    {launchData && launchData.payloads && launchData.payloads.length > 0 ? (
                        <ol>
                          {launchData.payloads.map((payload, index)=> (
                            <li key={index}>
                              <Link to ={`/payloads/${payload}`}>
                                {payload}
                              </Link>
                            </li>
                          ))}
                        </ol>
                    ) : (
                        <dd>N/A</dd>
                    )}
                   
                
                
                    <dt className="title">Cores:</dt>
                    {launchData && launchData.cores && launchData.cores.length > 0 ? (
                        <ol>
                          {launchData.cores.map((core, index)=> (
                            <li key={index}>
                              <Link to ={`/cores/${core.core}`}>
                                {core.core}
                              </Link>
                            </li>
                          ))}
                        </ol>
                    ) : (
                        <dd>N/A</dd>
                    )}
            </dl>
            <Link to='/launches/page/0'>Back to all launches</Link>
            <br></br>
            <Link to='/'>Home</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Launches;