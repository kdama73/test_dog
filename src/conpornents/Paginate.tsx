import React, { useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
interface PAGEPROPS {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  currentPage: number;
  total: number;
}

export const Paginate: React.FC<PAGEPROPS> = (props) => {
  const handleChangePage = (event:React.ChangeEvent<unknown>, pageNum:number) => {
    props.setCurrentPage(pageNum)
    console.log(props.currentPage);
    
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