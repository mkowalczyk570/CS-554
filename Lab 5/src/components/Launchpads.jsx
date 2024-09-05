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


const Launchpads = () => {
  const [launchpadData, setLaunchpadData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  let {id} = useParams();

 
  useEffect(() => {
    console.log('Launchpad useEffect fired');
    async function fetchData() {
      try {
        const {data: launchpad} = await axios.get(
          `https://api.spacexdata.com/v4/launchpads/${id}`
        );
        setLaunchpadData(launchpad);
        setLoading(false);
        console.log(launchpad);
      } catch (e) {
        setLoading(false)
        setStatus(true)
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
        <h2>Error 404: No launchpad with that id found</h2>
        <Link to="launchpads/page/0">All launchpads</Link>
        <br></br>
        <Link to="/">Home</Link>
    </div>)
  } 
  else {
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
          title={launchpadData.name}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            launchpadData && launchpadData.images && launchpadData.images.large
              ? launchpadData.images.large
              : noImage
          }
          title='Launchpad'
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
                    {launchpadData && launchpadData.name ? (
                        <dd>{launchpadData.name}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Details:</dt>
                    {launchpadData && launchpadData.details ? (
                        <dd>{launchpadData.details}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Status:</dt>
                    {launchpadData && launchpadData.status ? (
                        <dd>{launchpadData.status}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Region:</dt>
                    {launchpadData && launchpadData.region ? (
                        <dd>{launchpadData.region}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Locale:</dt>
                    {launchpadData && launchpadData.locality ? (
                        <dd>{launchpadData.locality}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Launch Attempts:</dt>
                    {launchpadData && launchpadData.launch_attempts ? (
                        <dd>{launchpadData.launch_attempts}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Launch Successes:</dt>
                    {launchpadData && launchpadData.launch_successes ? (
                        <dd>{launchpadData.launch_successes}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>

                <h1>Explore</h1>       
                    <dt className="title">Rockets:</dt>
                    {launchpadData && launchpadData.rockets && launchpadData.rockets.length > 0 ? (
                        <ol>
                          {launchpadData.rockets.map((rocket, index)=> (
                            <li key={index}>
                              <Link to ={`/rockets/${rocket}`}>
                                {rocket}
                              </Link>
                            </li>
                          ))}
                        </ol>
                    ) : (
                        <dd>N/A</dd>
                    )}
                    <dt className="title">Launches:</dt>
                    {launchpadData && launchpadData.launches && launchpadData.launches.length > 0 ? (
                        <ol>
                          {launchpadData.launches.map((launch, index)=> (
                            <li key={index}>
                              <Link to ={`/rockets/${launch}`}>
                                {launch}
                              </Link>
                            </li>
                          ))}
                        </ol>
                    ) : (
                        <dd>N/A</dd>
                    )}
            </dl>
            <Link to='/launchpads/page/0'>Back to all launchpads</Link>
            <br></br>
            <Link to='/'>Home</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Launchpads;