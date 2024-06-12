import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  setDoc,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Spinner from "./components/Spinner";
import { auth, db } from "./config/firebase.config";
import Home from "./container/Home";
import { useDispatch } from "react-redux";
import { SET_USER } from "./context/actions/userActions";
import NewProject from "./container/NewProject";
import { SET_PROJECTS } from "./context/actions/projectActions";

const App = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (userCred) => {
        if (userCred) {
          console.log(userCred?.providerData[0]);
          setDoc(
            doc(db, "users", userCred?.uid),
            userCred?.providerData[0]
          ).then(() => {
            dispatch(SET_USER(userCred?.providerData[0]));
            navigate("/home/projects", { replace: true });
          });
        } else {
          navigate("/home/auth", { replace: true });
        }
      }
    );
    setInterval(() => {
      setIsLoading(false);
    }, 500);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const projectQuery = query(
      collection(db, "projects"),
      orderBy("id", "desc")
    );

    const unsubscribe = onSnapshot(
      projectQuery,
      (snapshot) => {
        const projectsList = snapshot.docs.map((doc) =>
          doc.data()
        );
        dispatch(SET_PROJECTS(projectsList));
      }
    );

    return unsubscribe;
  }, [isLoading]);
  return (
    <>
      {isLoading ? (
        <div className='w-screen h-screen flex items-center justify-center overflow-hidden'>
          <Spinner />
        </div>
      ) : (
        <div className='w-screen h-screen flex items-start justify-start overflow-hidden'>
          <Routes>
            <Route path='/home/*' element={<Home />} />
            <Route
              path='/newProject'
              element={<NewProject />}
            />

            <Route
              path='/project/:id'
              element={<NewProject />}
            />
            <Route
              path='*'
              element={<Navigate to={"/home"} />}
            />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
