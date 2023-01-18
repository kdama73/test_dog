import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { ListItemButton } from '@mui/material';
import styles from './ResultDB.module.css'

interface DogProps {
        id: string;
        refId: string;
        enDescription: string;
        enName: string;
        jpDescription: string;
        jpName: string;
        jpSiteUrl: string;
        iDogUrl: string;
        relatedGene: string;
        relatedGeneUrl: string;
        dogBreed: string;
}

const ResultDB: React.FC<DogProps> = (props) => {
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