import React from "react";
import { CiHome } from "react-icons/ci";
import { CiHashtag } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
   return (
      <>
         <div className="w-[20%]">
            <div>
               <div>
                  <img
                     className="ml-5"
                     width={"24px"}
                     src="https://imgs.search.brave.com/x_qIHyAASAKHvFxd_4SV47FKtDr6Ft6gFuk9G1wPD98/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/cG5nbG9nby5jb20v/aW1hZ2VzL2FsbF9p/bWcvMTY5MTgzMjQ2/MHgtdHdpdHRlci1s/b2dvLXBuZy5wbmc"
                     alt="Twitter-Logo"
                  />
               </div>
               <div className="my-4">
                  <Link to="/" className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                     <div>
                        <CiHome size="24px" />
                     </div>
                     <h2>Home</h2>
                  </Link>

                  <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                     <div>
                        <CiHashtag size="24px" />
                     </div>
                     <h2>Explore</h2>
                  </div>
                  <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                     <div>
                        <IoIosNotificationsOutline size="24px" />
                     </div>
                     <h2>Notification</h2>
                  </div>
                  <Link
                     to="/profile"
                     className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full"
                  >
                     <div>
                        <CiUser size="24px" />
                     </div>
                     <h2>Profile</h2>
                  </Link>
                  <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                     <div>
                        <CiBookmark size="24px" />
                     </div>
                     <h2>Bookmarks</h2>
                  </div>
                  <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full">
                     <div>
                        <AiOutlineLogout size="24px" />
                     </div>
                     <h2>Logout</h2>
                  </div>

                  <button className="px-4 py-2 border-none text-md bg-[#1D9BF0] w-full rounded-full text-white font-bold'">
                     Post
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};

export default LeftSidebar;
