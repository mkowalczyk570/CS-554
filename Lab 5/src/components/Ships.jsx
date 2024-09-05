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


const Ships = () => {
  const [shipData, setShipData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  let {id} = useParams();

 
  useEffect(() => {
    console.log('Ship useEffect fired');
    async function fetchData() {
      try {
        const {data: ship} = await axios.get(
          `https://api.spacexdata.com/v4/ships/${id}`
        );
        setShipData(ship);
        setLoading(false);
        console.log(ship);
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
        <h2>Error 404: No ship with that id found</h2>
        <Link to="ships/page/0">All ships</Link>
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
          title={shipData.name}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            shipData && shipData.image
              ? shipData.image
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
                    <dt className="title">Type:</dt>
                    {shipData && shipData.type ? (
                        <dd>{shipData.type}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <dt className="title">Roles:</dt>
                    {shipData && shipData.roles && shipData.roles.length > 0 ? (
                        <ol>
                          {shipData.roles.map((role, index)=> (
                            <li key={index}>
                                {role}
                            </li>
                          ))}
                        </ol>
                    ) : (
                        <dd>N/A</dd>
                    )}
                <p>
                    <dt className="title">Home Port:</dt>
                    {shipData && shipData.home_port ? (
                        <dd>{shipData.home_port}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Active:</dt>
                    {shipData && shipData.active ? (
                        <dd>Yes</dd>
                    ) : (
                        <dd>No</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Mass:</dt>
                    {shipData && shipData.mass_kg && shipData.mass_lbs ? (
                        <dd>{shipData.mass_lbs} lbs | {shipData.mass_kg} kg</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <dt className="title">Launches:</dt>
                    {shipData && shipData.launches && shipData.launches.length > 0 ? (
                        <ol>
                          {shipData.launches.map((launch, index)=> (
                            <li key={index}>
                                <Link to ={`/launches/${launch}`}>
                                {launch}
                              </Link>
                            </li>
                          ))}
                        </ol>
                    ) : (
                        <dd>N/A</dd>
                    )}
                <p>
                    <dt className="title">Read more:</dt>
                    {shipData && shipData.link ? (
                        <dd><a href={shipData.link}>Details</a></dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
            </dl>
            <Link to='/ships/page/0'>Back to all ships</Link>
            <br></br>
            <Link to='/'>Home</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Ships;