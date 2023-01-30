import * as React from 'react';
import Search from './conpornents/Search';
import Home from './conpornents/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFound } from './conpornents/NotFound';

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path='/notfound' element={<NotFound />}/>
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default App;