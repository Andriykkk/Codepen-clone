import React, { useState } from "react";
import { HiChevronDoubleLeft } from "react-icons/hi2";
import { motion } from "framer-motion";
import { Link, Route, Routes } from "react-router-dom";
import Logo from "../assets/codepen-wordmark-black.webp";
import { MdHome } from "react-icons/md";
import { FaSearchengin } from "react-icons/fa";
import SignUp from "./SignUp";
import Projects from "./Projects";
import { useDispatch, useSelector } from "react-redux";
import UserProfileDetails from "../components/UserProfileDetails";
import { SET_SEARCH } from "../context/actions/searchActions";

const Home = () => {
  const [sideMenu, setSideMenu] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const searchText = useSelector((state) =>
    state.search?.search ? state.search?.search : ""
  );
  return (
    <>
      <div
        className={`w-2 ${
          sideMenu ? "w-0" : "flex-[.2] xl:flex-[.4]"
        } min-h-screen max-h-screen relative bg-secondary`}
      >
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={() => setSideMenu(!sideMenu)}
          className='w-8 h-8 bg-secondary rounded-tr-lg rounded-br-lg absolute -right-6 flex items-center justify-center cursor-pointer px-3 flex flex-col items-center justify-start gap-4 transition-all duration-200 ease-in-out'
        >
          <HiChevronDoubleLeft className='text-white text-xl h-[20px] w-[20px]' />
        </motion.div>

        <div
          className={` ${
            sideMenu
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          } overflow-hidden w-full flex flex-col gap-4 px-3`}
        >
          <Link
            to={"/home"}
            className='flex items-center justify-center py-4'
          >
            <img
              src={Logo}
              className='invert object-contain w-72 h-auto'
            />
          </Link>
          <Link to={"/newProject"}>
            <div className='px-6 py-3 flex items-center justify-center rounded-xl border border-gray-400 cursor-pointer group group-hover:border-gray-200 transition-all'>
              <p className='text-gray-400 group-hover:text-gray-200 capitalize transition-all'>
                Start Coding
              </p>
            </div>
          </Link>

          {user && (
            <Link
              to={"/home/projects"}
              className='flex items-center justify-center gap-6'
            >
              <MdHome className='text-primaryText text-xl' />
              <p className='text-lg text-primaryText'>
                Home
              </p>
            </Link>
          )}
        </div>
      </div>
      <div className='flex-1 min-h-screen max-h-screen overflow-y-scroll h-full flex flex-col items-start justify-start px-4 md:px-12 py-4'>
        <div className='px-4 py-3 w-full flex items-center justify-between gap-3'>
          <div className='bg-secondary w-full px-4 py-3 rounded-md flex items-center justify-center'>
            <FaSearchengin className='text-2xl text-primaryText' />
            <input
              value={searchText}
              onChange={(e) => {
                dispatch(SET_SEARCH(e.target.value));
              }}
              type='text'
              className='flex-1 px-4 py-1 text-xl bg-transparent outline-none border-none text-primaryText playceholder:text-gray-600 '
              placeholder='Search here...'
            />
          </div>

          {!user && (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className='flex items-center justify-center gap-3'
            >
              <Link
                to={"/home/auth"}
                className='bg-emerald-500 px-6 py-2 rounded-md text-white cursor-pointer text-lg hover:bg-emerald-700 transition-all'
              >
                SignUp
              </Link>
            </motion.div>
          )}
          {user && <UserProfileDetails />}
        </div>

        <div className='w-full'>
          <Routes>
            <Route path='/*' element={<Projects />} />
            <Route path='/auth' element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Home;
