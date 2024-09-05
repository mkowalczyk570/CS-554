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


const Rockets = () => {
  const [rocketData, setRocketData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  let {id} = useParams();

 
  useEffect(() => {
    console.log('Rocket useEffect fired');
    async function fetchData() {
      try {
        const {data: rocket} = await axios.get(
          `https://api.spacexdata.com/v4/rockets/${id}`
        );
        setRocketData(rocket);
        setLoading(false);
        console.log(rocket);
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
        <h2>Error 404: No rocket with that id found</h2>
        <Link to="rockets/page/0">All rockets</Link>
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
          title={rocketData.name}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
        />
        {rocketData && rocketData.flickr_images ? (
            <CardMedia
              component="img"
              image={rocketData.flickr_images[0]}
              title="Launch Patch"
            />
          ) : (
            <CardMedia
              component="img"
              image={noImage}
              title="No Image Available"
            />
          )}

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
                    {rocketData && rocketData.name ? (
                        <dd>{rocketData.name}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Description:</dt>
                    {rocketData && rocketData.description ? (
                        <dd>{rocketData.description}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Type:</dt>
                    {rocketData && rocketData.type ? (
                        <dd>{rocketData.type}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Active:</dt>
                    {rocketData && rocketData.active ? (
                        <dd>Yes</dd>
                    ) : (
                        <dd>No</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Stages:</dt>
                    {rocketData && rocketData.stages ? (
                        <dd>{rocketData.stages}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Cost per launch:</dt>
                    {rocketData && rocketData.cost_per_launch ? (
                        <dd>{rocketData.cost_per_launch}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Success rate:</dt>
                    {rocketData && rocketData.success_rate_pct ? (
                        <dd>{rocketData.success_rate_pct}%</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">First flight:</dt>
                    {rocketData && rocketData.first_flight ? (
                        <dd>{rocketData.first_flight}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Country:</dt>
                    {rocketData && rocketData.country ? (
                        <dd>{rocketData.country}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Company:</dt>
                    {rocketData && rocketData.company ? (
                        <dd>{rocketData.company}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <h1>Explore</h1>
                <p>
                    <dt className="title">Wikipedia:</dt>
                    {rocketData && rocketData.wikipedia ? (
                        <dd><a href= {rocketData.wikipedia}>Wikipedia page</a></dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                
                <h1>Rocket Stats</h1>
                <p>
                    <dt className="title">Height:</dt>
                    {rocketData && rocketData.height ? (
                        <dd>{rocketData.height.feet} feet | {rocketData.height.meters} meters</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Diameter:</dt>
                    {rocketData && rocketData.diameter ? (
                        <dd>{rocketData.diameter.feet} feet | {rocketData.diameter.meters} meters</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Weight:</dt>
                    {rocketData && rocketData.mass ? (
                        <dd>{rocketData.mass.lb} lbs | {rocketData.mass.kg} kg</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <h1>First Stage</h1>
                <p>
                    <dt className="title">Sea Level Thrust:</dt>
                    {rocketData && rocketData.first_stage && rocketData.first_stage.thrust_sea_level ? (
                        <dd>{rocketData.first_stage.thrust_sea_level.kN} kN</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Thrust Vacuum:</dt>
                    {rocketData && rocketData.first_stage && rocketData.first_stage.thrust_vacuum ? (
                        <dd>{rocketData.first_stage.thrust_vacuum.kN} kN</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Reusable:</dt>
                    {rocketData && rocketData.first_stage && rocketData.first_stage.reusable ? (
                        <dd>Yes</dd>
                    ) : (
                        <dd>No</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Engines:</dt>
                    {rocketData && rocketData.first_stage && rocketData.first_stage.engines ? (
                        <dd>{rocketData.first_stage.engines}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Fuel amount:</dt>
                    {rocketData && rocketData.first_stage && rocketData.first_stage.fuel_amount_tons ? (
                        <dd>{rocketData.first_stage.fuel_amount_tons} tons</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Burn time:</dt>
                    {rocketData && rocketData.first_stage && rocketData.first_stage.burn_time_sec ? (
                        <dd>{rocketData.first_stage.burn_time_sec} seconds</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <h1>Second Stage</h1>
                <p>
                    <dt className="title">Thrust:</dt>
                    {rocketData && rocketData.second_stage && rocketData.second_stage.thrust.kN ? (
                        <dd>{rocketData.second_stage.thrust.kN} kN</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Payload height:</dt>
                    {rocketData && rocketData.second_stage && rocketData.second_stage.payloads.composite_fairing.height.feet !==null ? (
                        <dd>{rocketData.second_stage.payloads.composite_fairing.height.feet} feet |
                         {rocketData.second_stage.payloads.composite_fairing.height.meters} meters</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Payload diameter:</dt>
                    {rocketData && rocketData.second_stage && rocketData.second_stage.payloads.composite_fairing.diameter.feet !== null ? (
                        <dd>{rocketData.second_stage.payloads.composite_fairing.diameter.feet} feet |
                         {rocketData.second_stage.payloads.composite_fairing.diameter.meters} meters</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Payload type:</dt>
                    {rocketData && rocketData.second_stage && rocketData.second_stage.payloads ? (
                        <dd>{rocketData.second_stage.payloads.option_1}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <h1>Engine Stats</h1>
                <p>
                    <dt className="title">Isp:</dt>
                    {rocketData && rocketData.engines && rocketData.engines.isp ? (
                        <dd>Sea level: {rocketData.engines.isp.sea_level} | Vacuum: {rocketData.engines.isp.sea_level}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Thrust sea level:</dt>
                    {rocketData && rocketData.engines && rocketData.engines.thrust_sea_level ? (
                        <dd>{rocketData.engines.thrust_sea_level.kN} kN | 
                        {rocketData.engines.thrust_sea_level.lbf} lbf</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Thrust vacuum:</dt>
                    {rocketData && rocketData.engines && rocketData.engines.thrust_vacuum ? (
                        <dd>{rocketData.engines.thrust_vacuum.kN} kN | 
                        {rocketData.engines.thrust_vacuum.lbf} lbf</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Number:</dt>
                    {rocketData && rocketData.engines &&rocketData.engines.number ? (
                        <dd>{rocketData.engines.number}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Type:</dt>
                    {rocketData && rocketData.engines &&rocketData.engines.type ? (
                        <dd>{rocketData.engines.type}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Version:</dt>
                    {rocketData && rocketData.engines &&rocketData.engines.version ? (
                        <dd>{rocketData.engines.version}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Layout:</dt>
                    {rocketData && rocketData.engines &&rocketData.engines.layout ? (
                        <dd>{rocketData.engines.layout}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Max engine loss:</dt>
                    {rocketData && rocketData.engines &&rocketData.engines.engine_loss_max ? (
                        <dd>{rocketData.engines.engine_loss_max}</dd>
                    ) : (
                        <dd>0</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Propellant 1:</dt>
                    {rocketData && rocketData.engines &&rocketData.engines.propellant_1 ? (
                        <dd>{rocketData.engines.propellant_1}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Propellant 2:</dt>
                    {rocketData && rocketData.engines &&rocketData.engines.propellant_2 ? (
                        <dd>{rocketData.engines.propellant_2}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Thrust to Weight:</dt>
                    {rocketData && rocketData.engines &&rocketData.engines.thrust_to_weight ? (
                        <dd>{rocketData.engines.thrust_to_weight}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <h1>Landing Gear</h1>
                <p>
                    <dt className="title">Landing legs:</dt>
                    {rocketData && rocketData.landing_legs ? (
                        <dd>{rocketData.landing_legs.number}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <p>
                    <dt className="title">Material:</dt>
                    {rocketData && rocketData.landing_legs && rocketData.landing_legs.material ? (
                        <dd>{rocketData.landing_legs.material}</dd>
                    ) : (
                        <dd>N/A</dd>
                    )}
                </p>
                <h1>Payloads</h1>
                
                <dt className="title">Payload weights:</dt>
                {rocketData && rocketData.payload_weights && rocketData.payload_weights.length > 0 ? (
                    <ol>
                        {rocketData.payload_weights.map((payload, index)=>(
                            <li key={index}>
                                id: {payload.id}
                                <br></br>
                                name: {payload.name}
                                <br></br>
                                weight: {payload.lb} lbs | {payload.kg} kg
                            </li>
                        ))}
                    </ol>
                    
                ) : (
                    <dd>N/A</dd>
                )}
            
                
                
            </dl>
            <Link to='/rockets/page/0'>Back to all rockets</Link>
            <br></br>
            <Link to='/'>Home</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Rockets;