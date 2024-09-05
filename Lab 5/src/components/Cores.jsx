import '../App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import noImage from '../assets/download.jpeg';

import {
  Card,
  CardContent,
  Typography,
  CardHeader
} from '@mui/material';


const Cores = () => {
  const [coreData, setCoreData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  let {id} = useParams();

 
  useEffect(() => {
    console.log('Core useEffect fired');
    async function fetchData() {
      try {
        const {data: core} = await axios.get(
          `https://api.spacexdata.com/v4/cores/${id}`
        );
        setCoreData(core);
        setLoading(false);
        console.log(core);
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
        <h2>Error 404: No core with that id found</h2>
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
          title={coreData.serial}
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
                    <dt className="title">Serial:</dt>
                    {coreData && coreData.serial ? (
                        <dd>{coreData.serial}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Last Update:</dt>
                    {coreData && coreData.last_update ? (
                        <dd>{coreData.last_update}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Status:</dt>
                    {coreData && coreData.status ? (
                        <dd>{coreData.status}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Block:</dt>
                    {coreData && coreData.block ? (
                        <dd>{coreData.block}</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Reuse count:</dt>
                    {coreData && coreData.reuse_count ? (
                        <dd>{coreData.reuse_count}</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Rtls attempts:</dt>
                    {coreData && coreData.rtls_attempts ? (
                        <dd>{coreData.rtls_attempts}</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Rtls landings:</dt>
                    {coreData && coreData.rtls_landings ? (
                        <dd>{coreData.rtls_landings}</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Asds attempts:</dt>
                    {coreData && coreData.asds_attempts ? (
                        <dd>{coreData.asds_attempts}</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Asds landings:</dt>
                    {coreData && coreData.asds_landings ? (
                        <dd>{coreData.asds_landings}</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <dt className="title">Launches:</dt>
                    {coreData && coreData.launches && coreData.launches.length > 0 ? (
                        <ol>
                          {coreData.launches.map((launch, index)=> (
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
            </dl>
            <Link to='/cores/page/0'>Back to all cores</Link>
            <br></br>
            <Link to='/'>Home</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Cores;