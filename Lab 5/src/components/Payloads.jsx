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


const Payloads = () => {
  const [payloadData, setPayloadData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  let {id} = useParams();

 
  useEffect(() => {
    console.log('Payload useEffect fired');
    async function fetchData() {
      try {
        const {data: payload} = await axios.get(
          `https://api.spacexdata.com/v4/payloads/${id}`
        );
        setPayloadData(payload);
        setLoading(false);
        console.log(payload);
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
        <h1>Error 404: No payload with that id found</h1>
        <Link to="payloads/page/0">All payloads</Link>
        <br></br>
        <Link to="/">Home</Link>
    </div>
    )
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
          title={payloadData.name}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
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
                    {payloadData && payloadData.type ? (
                        <dd>{payloadData.type}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <dt className="title">Launch:</dt>
                    {payloadData && payloadData.launch ? (
                        <dd>
                            <Link to ={`/launches/${payloadData.launch}`}>
                                {payloadData.launch}
                            </Link>
                          </dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                <p>
                    <dt className="title">Reused:</dt>
                    {payloadData && payloadData.reused ? (
                        <dd>Yes</dd>
                    ) : (
                        <dd>No</dd>
                    )}
                </p>
                
                <h1>Payload Stats</h1>
                <p>
                    <dt className="title">Mass:</dt>
                    {payloadData && payloadData.mass_kg && payloadData.mass_lbs ? (
                        <dd>{payloadData.mass_lbs} lbs | {payloadData.mass_kg} kg</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Orbit:</dt>
                    {payloadData && payloadData.orbit  ? (
                        <dd>{payloadData.orbit}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Reference System:</dt>
                    {payloadData && payloadData.reference_system  ? (
                        <dd>{payloadData.reference_system}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Regime:</dt>
                    {payloadData && payloadData.regime  ? (
                        <dd>{payloadData.regime}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Longitude:</dt>
                    {payloadData && payloadData.longitude  ? (
                        <dd>{payloadData.longitude}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Semi major axis km:</dt>
                    {payloadData && payloadData.semi_major_axis_km  ? (
                        <dd>{payloadData.semi_major_axis_km} km</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Eccentricity:</dt>
                    {payloadData && payloadData.eccentricity  ? (
                        <dd>{payloadData.eccentricity}</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Periapsis km:</dt>
                    {payloadData && payloadData.periapsis_km  ? (
                        <dd>{payloadData.periapsis_km} km</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Apoapsis km:</dt>
                    {payloadData && payloadData.apoapsis_km  ? (
                        <dd>{payloadData.apoapsis_km} km</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Inclination deg:</dt>
                    {payloadData && payloadData.inclination_deg  ? (
                        <dd>{payloadData.inclination_deg} degrees</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Period min:</dt>
                    {payloadData && payloadData.period_min  ? (
                        <dd>{payloadData.period_min}</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Apoapsis km:</dt>
                    {payloadData && payloadData.apoapsis_km  ? (
                        <dd>{payloadData.apoapsis_km} km</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Lifespan years:</dt>
                    {payloadData && payloadData.lifespan_years  ? (
                        <dd>{payloadData.lifespan_years} years</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Epoch:</dt>
                    {payloadData && payloadData.epoch  ? (
                        <dd>{payloadData.epoch}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Mean motion:</dt>
                    {payloadData && payloadData.mean_motion  ? (
                        <dd>{payloadData.mean_motion}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Raan:</dt>
                    {payloadData && payloadData.raan  ? (
                        <dd>{payloadData.raan}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Arg of pericenter:</dt>
                    {payloadData && payloadData.arg_of_pericenter  ? (
                        <dd>{payloadData.arg_of_pericenter}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Mean anomaly:</dt>
                    {payloadData && payloadData.mean_anomaly  ? (
                        <dd>{payloadData.mean_anomaly}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
            </dl>
            <Link to='/payloads/page/0'>Back to all payloads</Link>
            <br></br>
            <Link to='/'>Home</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Payloads;