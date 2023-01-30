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
  orderBy,
  startAfter,
} from 'firebase/firestore';
import ResultDB from './ResultDB';
import { Paginate } from './Paginate';
import { DOGDATA } from '../interfaces/dogData.interface';
import { jpNameArray } from '../searchKeywords/jpName';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [dogDatas, setDogdatas] = useState<Pick<DOGDATA, "id" | "jpName" | "jpDescription" | "enDescription" | "refId">[]>([]);
  const [searchData, setSearchData] = useState<Pick<DOGDATA, "id" | "jpName" | "jpDescription" | "enDescription" | "refId">>();
  const [isFormInputted, setIsFormInputted] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const displayLimit = 20;
  const total = Math.ceil(805/displayLimit) //805はデータの総数
  const navigate = useNavigate();

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
        jpDescription: doc.data().jpDescription,
        jpName: doc.data().jpName,
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
  const setDogDataPerPage= async (init?: boolean) => {
    if (init) {
      setCurrentPage(1);
    }
    const order = ("0000"+(currentPage-1)*displayLimit).slice(-4)
    const q = query(collection(db, 'dogDatas'), limit(displayLimit) ,orderBy("refId"), startAfter("DDID"+order));
    const currentDatas = await getDocs(q);
    setDogdatas(
      currentDatas.docs.map((doc) => ({
        id: doc.data().id,
        refId: doc.data().refId,
        enDescription: doc.data().enDescription,
        jpDescription: doc.data().jpDescription,
        jpName: doc.data().jpName,
      })))
  }

  useEffect(() => {
    const queryParams = Number(searchParams.get("page"));
    if (searchParams.get("page") === null) {
      setDogDataPerPage(true);
    } else if (queryParams > total || !queryParams) {
      navigate("/notfound");
    }
    setCurrentPage(queryParams);
    setDogDataPerPage();
  window.scrollTo({top: 0});
  }, [currentPage]);

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

          <div>
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
            <li> <a href="https://ngdc.cncb.ac.cn/idog/index.jsp">iDog</a></li>
          </div>
        </div>
        {isFormInputted && (<Paginate currentPage={currentPage} setCurrentPage={setCurrentPage} total={total}/>)}
      </Container>
    </>
  );
};
export default Search;
