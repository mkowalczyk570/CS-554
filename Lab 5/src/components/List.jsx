import "../App.css";
import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";

const List = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const {page} = useParams();
  const pageNum = parseInt(page)
  const validPropTypes = ["cores", "launchpads", "launches", "rockets", "payloads", "ships"]
  let nextExists = false;
  let prevExists = false
  
  useEffect(() => {
    async function fetchData() {
      if(!validPropTypes.includes(props.type.toLowerCase())) throw ("Invalid prop type")
      try {
        const {data} = await axios.post(
          `https://api.spacexdata.com/v4/${props.type}/query`,
          {
            "query": {},
            "options": {
              "limit": 10,
              "page": pageNum,
            },
          }
        );
        setCurrentPage(parseInt(page));
        setData(data)
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [page]);
  useEffect(() =>{
    async function fetchTotal(){
      try{
        const {data} = await axios.get(`https://api.spacexdata.com/v4/${props.type}`)
        const dataLength = data.length;
        setTotalPages(Math.ceil(dataLength / 10));
      }catch(e){
        console.log(e)
      }
    }
    fetchTotal()
  }, [])
  


  if (totalPages < currentPage || currentPage < 0 || isNaN(currentPage)) {
    return (
      <div>
        <h2>404: Page Not Found</h2>
        <Link to={`/${props.type}/page/0`}>
          Back to {props.type}
        </Link>
        <br></br>
        <Link to="/">Home</Link>
      </div>
    );
  } else if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    
    return (    
      
      <div>
        <h1>List of {props.type}</h1>
        {data && data.docs.map((data) => {
          return data.name ? (
            <Link key={data.name} to={`/${props.type}/${data.id}`}>{data.name}<br></br></Link>
            
          ) : (
            <Link key={data.name} to={`/${props.type}/${data.id}`}>{data.serial}<br></br></Link>
          )
        })}

        <div>
          {data.hasNextPage ? (
            <Link to={`/${props.type}/page/${currentPage + 1}`}>Next</Link>
          ) : null}
          <br></br>
          {data.hasPrevPage ? (
            <Link to={`/${props.type}/page/${currentPage - 1}`}>Previous</Link>
          ) : null}
          <br></br>
          <Link to="/">Home</Link>
          <br></br>
        </div>
      </div>
    );
  }
};

export default List;
