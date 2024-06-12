import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";

const Projects = () => {
  const projects = useSelector(
    (state) => state.projects?.projects
  );
  const searchText = useSelector((state) =>
    state.search?.search ? state.search?.search : ""
  );
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    if (searchText.length > 0) {
      setFilter(
        projects.filter((projects) => {
          const loverCaseItem =
            projects?.title.toLowerCase();
          return searchText
            .split("")
            .every((letter) =>
              loverCaseItem.includes(letter)
            );
        })
      );
      console.log(
        projects.filter((projects) => {
          const loverCaseItem =
            projects?.title.toLowerCase();
          return searchText
            .split("")
            .every((letter) =>
              loverCaseItem.includes(letter)
            );
        })
      );
    } else {
      setFilter(null);
    }
  }, [searchText]);

  return (
    <div className='w-full py-6 flex items-center justify-center gap-6 flex-wrap'>
      {filter ? (
        <>
          {filter &&
            filter.map((project, index) => {
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              );
            })}
        </>
      ) : (
        <>
          {projects &&
            projects.map((project, index) => {
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              );
            })}
        </>
      )}
    </div>
  );
};

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: index * 0.1,
      }}
      className='w-full cursor-pointer md:w-[450px] h-[375px] bg-secondary rounded-md p-4 flex flex-col items-center justify-center gap-4'
    >
      <div
        className='w-full h-full bg-primary rounded-md overflow-hidden '
        style={{
          overflow: "hidden",
          height: "100%",
        }}
      >
        <iframe
          title='result'
          srcDoc={project.output}
          style={{
            border: "none",
            height: "100%",
            width: "100%",
          }}
        ></iframe>
      </div>
      <Link
        to={`/project/${project?.id}`}
        className='flex items-center justify-start gap-3 w-full'
      >
        <div className='w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer bg-emerals-500 bg-emerald-500'>
          {project?.user?.photoURL ? (
            <>
              <motion.div
                whileHover={{ scale: 1.2 }}
                src={project?.user?.photoURL}
                alt={project?.user?.displayName}
                referrerPolicy='no-referrer'
                className='w-full h-full object-cover'
              ></motion.div>
            </>
          ) : (
            <p className='text-xl text-white font-semibold capitalize'>
              {project?.user?.email[0]}
            </p>
          )}
        </div>
        <div>
          <p className='text-white text-lg capitalize'>
            {project?.title}
          </p>
          <p className='text-primaryText text-sm capitalize'>
            {project?.user?.displayName
              ? project?.user?.displayName
              : `${project?.user?.email.split("@")[0]}`}
          </p>
        </div>

        <motion.div
          className='cursor-pointer ml-auto'
          whileTap={{ scale: 0.9 }}
        >
          {/* <FaBookmark className='text-primaryText text-3xl' /> */}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default Projects;
