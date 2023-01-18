import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, getDocs, where, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { spawn } from 'child_process';
import ResultDB from './ResultDB';
import { List, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Autocomplete from '@mui/material/Autocomplete';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import { style } from '@mui/system';
import styles from './Home.module.css';
import PetsIcon from '@mui/icons-material/Pets';

const Home: React.FC = () => {
  const [dogDatas, setDogDatas] = useState([
    {
        id: '',
        refId: '',
        enDescription: '',
        enName: '',
        jpDescription: '',
        jpName: '',
        jpSiteUrl: '',
        iDogUrl: '',
        relatedGene: '',
        relatedGeneUrl: '',
        dogBreed: '',
    },
  ]);

  const [searchData,setSearchData] = useState(
    {
      id: '',
      refId: '',
      enDescription: '',
      enName: '',
      jpDescription: '',
      jpName: '',
      jpSiteUrl: '',
      iDogUrl: '',
      relatedGene: '',
      relatedGeneUrl: '',
      dogBreed: ''
  },
  )

  const setSearchText = async (value:string) =>{
    const dogDatasRef = collection(db,'dogDisease')
    const searchDoc = await getDocs(query(dogDatasRef,where('jpName','==',value)))
    searchDoc.forEach((doc) => {
      // firestore にデータを入れるとき整合性をチェック
      // setSearchData(
      //   id: doc.data().id,
      //   refId: doc.data().refId,
      //   enDescription: doc.data().enDescription,
      //   enName: doc.data().enName,
      //   jpDescription: doc.data().jpDescription,
      //   jpName: doc.data().jpName,
      //   jpSiteUrl: doc.data().jpSiteUrl,
      //   iDogUrl: doc.data().iDogUrl,
      //   relatedGene: doc.data().relatedGene,
      //   relatedGeneUrl: doc.data().relatedGeneUrl,
      //   dogBreed: doc.data().dogBreed,
      // )

      setSearchData({
      id: doc.data().id,
      refId: doc.data().refId,
      enDescription: doc.data().description,
      enName: doc.data().diseaseName,
      jpDescription: doc.data().jpDescription,
      jpName: doc.data().jpName,
      jpSiteUrl: doc.data().jpSite,
      iDogUrl: doc.data().iDogURL,
      relatedGene: doc.data().genes,
      relatedGeneUrl: doc.data().genesURL,
      dogBreed: doc.data().beeds,
    })
    console.log(searchData);
    })
    
    
  }
  useEffect(() => {
    const q = query(collection(db, 'dogDisease'));
    const unSub = onSnapshot(q, (snapshot) => {
      setDogDatas(
        snapshot.docs.map((doc) => ({
        id: doc.data().id,
        refId: doc.data().refId,
        enDescription: doc.data().enDescription,
        enName: doc.data().enName,
        jpDescription: doc.data().jpDescription,
        jpName: doc.data().jpName,
        jpSiteUrl: doc.data().jpSiteUrl,
        iDogUrl: doc.data().iDogUrl,
        relatedGene: doc.data().relatedGene,
        relatedGeneUrl: doc.data().relatedGeneUrl,
        dogBreed: doc.data().dogBreed,
        }))
      );
    });
    return () => {
      unSub();
    };
  }, []);

  return (
    <div className="ResultDB">
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <PetsIcon sx={{marginRight:'12px'}}/>
          <Typography sx={{marginTop:'4px'}}>DogDoc</Typography>
        </Toolbar>
      </AppBar>
      <Container fixed sx={{ paddingTop: '80px' }}>
        <div className={styles.contens_wrap}>
          <List
            sx={{
              bgcolor: 'background.paper',
              marginRight: '24px'
            }}
          >
            {searchData.jpName.length >= 1 ? (
              <>
                <ResultDB key={searchData?.id} {...searchData} />
              </>
            ) : (
              dogDatas.map((data) => (
                <>
                  <ResultDB key={data.id} {...data} />
                </>
              ))
            )}
          </List>
          <Autocomplete
            noOptionsText='一致する病名がありません'
            disablePortal
            id="combo-box-demo"
            options={dogDatas.map((data) => {
              return data.jpName;
            })}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="病名" />}
            onInputChange={(event, newValue, reason) => {
              reason !== "reset"
                ? setSearchData({
                    id: "",
                    refId: "",
                    enDescription: "",
                    enName: "",
                    jpDescription: "",
                    jpName: "",
                    jpSiteUrl: "",
                    iDogUrl: "",
                    relatedGene: "",
                    relatedGeneUrl: "",
                    dogBreed: "",
                  })
                : setSearchText(newValue);
            }}
          />
        </div>
      </Container>
    </div>
  );
};

export default Home;
