import React from 'react'
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
        <div>Home</div>
        <Link to='/search'>
            <button>検索</button>
        </Link>
    </>
  )
}
export default Home;
