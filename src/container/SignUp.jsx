import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { fadeInOut } from "../animations";
import Logo from "../assets/codepen-wordmark-black.webp";
import UserAuthInput from "../components/UserAuthInput";
import { auth } from "../config/firebase.config";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [
    getEmailValidationStatus,
    setEmailValidationStatus,
  ] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const createNewUser = async () => {
    if (getEmailValidationStatus) {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
        .then((userCred) => {
          if (userCred) {
            console.log(userCred);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const loginWithEmailPassword = async () => {
    if (getEmailValidationStatus) {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
        .then((userCred) => {
          if (userCred) {
            console.log(userCred);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.message.includes("user-not-found")) {
            setAlert(true);
            setAlertMsg("No user found with this email");
          } else if (
            error.message.includes("wrong-password")
          ) {
            setAlert(true);
            setAlertMsg("Wrong Password");
          } else {
            setAlert(true);
            setAlertMsg("Something went wrong");
          }

          setInterval(() => {
            setAlert(false);
          }, 3000);
        });
    }
  };

  return (
    <div className='w-full py-6 '>
      <img
        src={Logo}
        className='invert object-contain w-32 opacity-50 h-auto'
      />
      <div className='w-full flex flex-col items-center justify-center py-8'>
        <p className='py-12 text-2xl text-primaryText'>
          Join With Us!
        </p>
        <div className='px-8 w-full md:w-auto py-8 rounded-xl bg-secondary shadow-md flex flex-col items-center justify-center gap-8'>
          <UserAuthInput
            label='Email'
            placeHolder='Email'
            isPassword={false}
            key='Email'
            setStateFunction={setEmail}
            Icon={FaEnvelope}
            setEmailValidationStatus={
              setEmailValidationStatus
            }
          />
          <UserAuthInput
            label='Password'
            placeHolder='Password'
            isPassword={true}
            key='Password'
            setStateFunction={setPassword}
            Icon={MdPassword}
          />

          <AnimatePresence>
            {alert && (
              <motion.p
                key={"AlertMessage"}
                {...fadeInOut}
                className='text-red-500'
              >
                {alertMsg}
              </motion.p>
            )}
          </AnimatePresence>

          {isLogin ? (
            <motion.div
              onClick={createNewUser}
              whileTap={{ scale: 0.9 }}
              className='flex items-center justify-center w-full py-3 rounded-xl hover:bg-emerald-400 cursor-pointer bg-emerald-500'
            >
              <p className='text-xl text-white'>Sign Up</p>
            </motion.div>
          ) : (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className='flex items-center justify-center w-full py-3 rounded-xl hover:bg-emerald-400 cursor-pointer bg-emerald-500'
            >
              <p className='text-xl text-white'>Login</p>
            </motion.div>
          )}

          {isLogin ? (
            <p className='tex-sm text-primaryText flex items-center justify-center gap-3'>
              Already have an account?{" "}
              <span
                onClick={() => setIsLogin(false)}
                className='text-emerald-500 cursor-pointer'
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className='tex-sm text-primaryText flex items-center justify-center gap-3'>
              Doesn't have an account?{" "}
              <span
                onClick={() => setIsLogin(true)}
                className='text-emerald-500 cursor-pointer'
              >
                Create Here
              </span>
            </p>
          )}

          {/* <div className='flex items-center justify-center gap-12'>
            <div className='h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-24'></div>
            <p className='text-sm text-[rgba(256,256,256,0.2)]'>
              OR
            </p>
            <div className='h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-24'></div>
          </div>

          <motion.div
            onClick={signInWithGoogle}
            className='flex items-center justify-center gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer transition-all'
            whileTap={{ scale: 0.9 }}
          >
            <FcGoogle className='text-3xl' />
            <p className='text-xl text-white'>
              Sign in with Google
            </p>
          </motion.div>

          <div className='flex items-center justify-center gap-12'>
            <div className='h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-24'></div>
            <p className='text-sm text-[rgba(256,256,256,0.2)]'>
              OR
            </p>
            <div className='h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-24'></div>
          </div>

          <motion.div
            onClick={signInWithGitHub}
            className='flex items-center justify-center gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer transition-all'
            whileTap={{ scale: 0.9 }}
          >
            <FaGithub className='text-3xl text-white' />
            <p className='text-xl text-white'>
              Sign in with GitHub
            </p>
          </motion.div> */}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
