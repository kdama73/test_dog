import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import React from 'react';
import { useNavigate } from 'react-router-dom';
interface PAGEPROPS {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  currentPage: number;
  total: number;
}

export const Paginate: React.FC<PAGEPROPS> = (props) => {
  const navigate = useNavigate();
  const handleChangePage = (event:React.ChangeEvent<unknown>, pageNum:number) => {
    props.setCurrentPage(pageNum)
    navigate({
      pathname: "/search",
      search: `?page=${pageNum}`
    });
  }
  return (
    <Stack spacing={2}>
      <Pagination 
      count={props.total} 
      showFirstButton 
      showLastButton 
      variant="outlined"
      page={props.currentPage}
      onChange={(event, pageNum) => handleChangePage(event, pageNum)}
      />
    </Stack>
  );
}