import React, { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaCss3,
  FaHtml5,
  FaJs,
} from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import Split from "react-split";
import { motion } from "framer-motion";
import Logo from "../assets/codepen-wordmark-black.webp";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MdCheck, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { Alert, UserProfileDetails } from "../components";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";

const NewProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [output, setOutput] = useState("");
  const [alert, setAlert] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [isTitle, setIsTitle] = useState("");
  const [title, setTitle] = useState("Untitled");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    updateOutput();
  }, [html, css, js]);

  const updateOutput = () => {
    const combinedOutput = `
	<html>
		<head>
			<style>
				${css}
			</style>
		</head>
		<body>
			${html}
			<script>
				${js}
			</script>
		</body>
	</html>`;
    setOutput(combinedOutput);
  };

  const saveProgram = async () => {
    if (disabled) return;
    const projectId = id || `${Date.now()}`; // Use the existing id or create a new one
    const _doc = {
      id: projectId,
      title,
      html,
      css,
      js,
      output,
      user: user,
    };

    try {
      const docRef = await setDoc(
        doc(db, "projects", projectId),
        _doc
      );

      setAlert(true);
      setTimeout(() => {
        setAlert(false);
        setDisabled(false);
        if (!id) {
          navigate(`/project/${projectId}`);
        }
      }, 2000);
      if (!id) {
        setDisabled(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      const docRef = doc(db, "projects", id); // Correctly create document reference
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProject(data);
        setHtml(data.html);
        setCss(data.css);
        setJs(data.js);
        setTitle(data.title);
        setOutput(data.output);
      } else {
        console.log("No such document!");
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  return (
    <div className='w-screen h-screen flex flex-col items-start justify-start overflow-hidden'>
      <AnimatePresence>
        {alert && (
          <Alert
            status={"Success"}
            message={"Project Saved..."}
          />
        )}
      </AnimatePresence>
      <header className='w-full flex items-center justify-between px-12 py-4'>
        <div className='flex items-center justify-center gap-6'>
          <Link to={"/home/projects"}>
            <img
              src={Logo}
              className='w-32 h-auto object-contain invert'
            />
          </Link>

          <div className='flex flex-col items-start justify-start'>
            <div className='flex items-center justify-center gap-3'>
              <AnimatePresence>
                {isTitle ? (
                  <>
                    <motion.input
                      key={"TitleInput"}
                      type='text'
                      placeholder='Your Title'
                      value={title}
                      className='px-3 py-2 rounded-lg border bg-transparent text-white border-none text-base outline-none'
                      onChange={(e) =>
                        setTitle(e.target.value)
                      }
                    />
                  </>
                ) : (
                  <>
                    <motion.p
                      key={"titleLabel"}
                      className='px-3 py-2 text-white text-lg`'
                    >
                      {title}
                    </motion.p>
                  </>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isTitle ? (
                  <>
                    <motion.div
                      key={"MdCheck"}
                      whileTap={{ scale: 0.9 }}
                      className='cursor-pointer'
                      onClick={() => setIsTitle(false)}
                    >
                      <MdCheck className='text-2xl text-emerald-500' />
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      key={"MdEdit"}
                      whileTap={{ scale: 0.9 }}
                      className='cursor-pointer'
                      onClick={() => setIsTitle(true)}
                    >
                      <MdEdit className='text-2xl text-primaryText' />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className='flex items-center justify-center px-3 -mt-2 gap-2 '>
              <p className='text-primaryText text-sm'>
                {user?.displayName
                  ? user?.displayName
                  : `${user?.email.split("@")[0]}`}
              </p>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className='text-[10px] bg-emerald-500 rounded-sm px-2 py-[1px] text-primary font-semibold cursor-pointer'
              >
                + Follow
              </motion.div>
            </div>
          </div>
        </div>

        {user && (
          <div className='flex items-center justify-center gap-4'>
            <motion.button
              onClick={saveProgram}
              className={`${
                disabled
                  ? "cursor-not-allowed opacity-60"
                  : ""
              } px-6 py-4 cursor-pointer text-base text-primary font-semibold rounded-md bg-primaryText`}
            >
              Save
            </motion.button>
            <UserProfileDetails />
          </div>
        )}
      </header>
      <div className='h-full w-full'>
        <Split
          class='comp2 intterWrap'
          className='h-full'
          sizes={[50, 50]}
          direction='vertical'
        >
          <div>
            <Split
              class='w-full h-full flex'
              sizes={[33, 33, 34]}
              minSize={100}
              gutterSize={10}
            >
              <div className='h-full'>
                <div className='w-full h-full flex flex-col items-start justify-start'>
                  <div className='w-full flex items-center justify-between'>
                    <div className='bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500'>
                      <FaHtml5 className='text-xl text-red-500' />
                      <p className='text-primaryText font-semibold '>
                        HTML
                      </p>
                    </div>

                    <div className='cursor-pointer flex items-center justify-center gap-5 px-4'>
                      <FcSettings className='text-xl' />
                      <FaChevronDown className='text-xl text-primaryText' />
                    </div>
                  </div>
                  <div className='w-full h-full overflow-auto'>
                    <CodeMirror
                      value={html}
                      className='h-full'
                      theme={"dark"}
                      extensions={[
                        javascript({ jsx: true }),
                      ]}
                      onChange={(value, viewUpdate) => {
                        setHtml(value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{ border: "1px solid #34363e" }}
                className='h-full'
              >
                <div className='w-full h-full flex flex-col items-start justify-start'>
                  <div className='w-full flex items-center justify-between'>
                    <div className='bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500'>
                      <FaCss3 className='text-xl text-sky-500' />
                      <p className='text-primaryText font-semibold '>
                        CSS
                      </p>
                    </div>

                    <div className='cursor-pointer flex items-center justify-center gap-5 px-4'>
                      <FcSettings className='text-xl' />
                      <FaChevronDown className='text-xl text-primaryText' />
                    </div>
                  </div>
                  <div className='w-full h-full  overflow-auto'>
                    <CodeMirror
                      value={css}
                      className='h-full'
                      theme={"dark"}
                      extensions={[
                        javascript({ jsx: true }),
                      ]}
                      onChange={(value, viewUpdate) => {
                        setCss(value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{ border: "1px solid #34363e" }}
                className='h-full'
              >
                <div className='w-full h-full flex flex-col items-start justify-start'>
                  <div className='w-full flex items-center justify-between'>
                    <div className='bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500'>
                      <FaJs className='text-xl text-yellow-500' />
                      <p className='text-primaryText font-semibold '>
                        JS
                      </p>
                    </div>

                    <div className='cursor-pointer flex items-center justify-center gap-5 px-4'>
                      <FcSettings className='text-xl' />
                      <FaChevronDown className='text-xl text-primaryText' />
                    </div>
                  </div>
                  <div className='w-full h-full overflow-auto'>
                    <CodeMirror
                      value={js}
                      className='h-full'
                      theme={"dark"}
                      extensions={[
                        javascript({ jsx: true }),
                      ]}
                      onChange={(value, viewUpdate) => {
                        setJs(value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Split>
          </div>
          <div
            className='w-full h-full bg-white '
            style={{
              overflow: "hidden",
              height: "100%",
            }}
          >
            <iframe
              title='result'
              srcDoc={output}
              style={{
                border: "none",
                height: "100%",
                width: "100%",
              }}
            ></iframe>
          </div>
        </Split>
      </div>
    </div>
  );
};

export default NewProject;
