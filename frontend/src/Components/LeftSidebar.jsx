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
                     className="ml-5 h-11"
                     src="https://imgs.search.brave.com/ZhDTc19u3Xv8PyZhNmN3n3svlp1Wr_pndpywRRjXxjU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE3LzA2/L1R3aXR0ZXItTG9n/JUQwJUJFLTUwMHgy/ODEucG5n"
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
