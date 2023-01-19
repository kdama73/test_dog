import React, { useEffect, useState } from 'react';
import styles from './Search.module.css';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import ResultDB from './ResultDB';
import { DOGDATA } from '../interfaces/dogData.interface';
import { jpNameArray } from '../searchKeywords/jpName';
import { Link } from "react-router-dom";
import {
  Typography,
  List,
  AppBar,
  Autocomplete,
  Container,
  TextField,
  Toolbar,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const Search: React.FC = () => {
  const [dogDatas, setDogdatas] = useState<DOGDATA[]>([]);
  const [searchData, setSearchData] = useState<DOGDATA>();
  const [isFormInputted, setIsFormInputted] = useState(true);

  const setSearchText = async (keyword: string | null) => {
    const dogDatasRef = collection(db, 'dogDatas');
    const searchDoc = await getDocs(
      query(dogDatasRef, where('jpName', '==', keyword))
    );
    searchDoc.docs.forEach((doc) => {
      setSearchData({
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
      });
    });
  };

  // DBへ送るデータをまとめる関数
  // const mergeDogData = () => {
  //   return {
  //     refId: refIdArray,
  //     enDescription: enDescriptionArray,
  //     enName: enNameArray,
  //     jpDescription: jpDescriptionArray,
  //     jpName: jpNameArray,
  //     jpSiteUrl: jpSiteUrlArray,
  //     iDogUrl: iDogUrlArray,
  //     relatedGene: relatedGeneArray,
  //     relatedGeneUrl: relatedGeneUrlArray,
  //     dogBreed: dogBreedArray,
  //   };
  // };

  // DBへ検索データを一括追加する関数
  // const setDbData = () => {
  //   const data = mergeDogData();
  //   const dataLength = data.refId.length;
  //   const datas: Omit<DOGDATAS, "id">[] = [...Array(dataLength)].map((_, i) => {
  //     return {
  //       refId: data.refId[i],
  //       enDescription: data.enDescription[i],
  //       enName: data.enName[i],
  //       jpDescription: data.jpDescription[i],
  //       jpName: data.jpName[i],
  //       jpSiteUrl: data.jpSiteUrl[i],
  //       iDogUrl: data.iDogUrl[i],
  //       relatedGene: data.relatedGene[i],
  //       relatedGeneUrl: data.relatedGeneUrl[i],
  //       dogBreed: data.dogBreed[i],
  //     };
  //   });
  //   datas.forEach(async (res) => {
  //     const docRef = doc(collection(db, "dogDatas"));
  //     await setDoc(docRef, { id: docRef.id, ...res })
  //       .then(() => console.log("追加完了"))
  //       .catch((e) => {
  //         console.log(e.message);
  //         console.log(e.error);
  //       });
  //   });
  // };

  useEffect(() => {
    const q = query(collection(db, 'dogDatas'), limit(5));
    const unSub = onSnapshot(q, (snapshot) => {
      setDogdatas(
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
    <>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
            <PetsIcon sx={{ marginRight: '12px' }} />
            <Link className={styles.logo} to="/">
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                marginTop: '2px',
                fontFamily: 'Anton, sans-serif',
                fontSize: '24px',
              }}
            >
              DogDoc
            </Typography>
            </Link>

        </Toolbar>
      </AppBar>
      <Container fixed sx={{ paddingTop: '80px' }}>
        <div className={styles.contens_wrap}>
          <List
            sx={{
              bgcolor: 'background.paper',
              marginRight: '24px',
            }}
          >
            <>
              {searchData !== undefined ? (
                <ResultDB {...searchData} />
              ) : (
                dogDatas.map((data) => <ResultDB key={data.id} {...data} />)
              )}
            </>
          </List>

          <Autocomplete
            disablePortal
            noOptionsText="一致する病名がありません"
            id="combo-box-demo"
            options={[...jpNameArray]}
            sx={{ width: '100%' }}
            onChange={(_, newValue, reason) => {
              reason === 'clear' && newValue === null
                ? setIsFormInputted(true)
                : setIsFormInputted(false);
              {
                isFormInputted
                  ? setSearchText(newValue)
                  : setSearchData(undefined);
              }
            }}
            renderInput={(params) => <TextField {...params} label="病名" />}
          />
        </div>
      </Container>
    </>
  );
};
export default Search;
