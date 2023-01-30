import { ListItemButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import React from 'react';
import { DOGDATA } from '../interfaces/dogData.interface';
import styles from './ResultDB.module.css';

const ResultDB: React.FC<DOGDATA> = (props) => {
  return (
    <div>
      
      <>
      <ListItem alignItems="flex-start" disablePadding>
        <ListItemButton>
        <ListItemText className={styles.list_text}
          primary={props.jpName}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {props.jpDescription}
              </Typography>
            </React.Fragment>
          }
        />
        </ListItemButton>
      </ListItem>
      <Divider/>
      </>
    </div>
  )
}

export default ResultDB;