import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export const NotFound = () => {
    useEffect(() => {
        history.pushState(null, "", null);
    });
  return (
    <div>
        <p>ページが存在しません</p>
        <Link to="/search">
        <button>top</button>
        </Link>
    </div>
  )
}
