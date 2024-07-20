import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
const Profile = () => {
   return (
      <div className="w-[50%] border-l border-r border-gray-200">
         <div>
            <div className="flex items-center py-2">
               <Link
                  to="/"
                  className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
               >
                  <IoMdArrowBack size="24px" />
               </Link>
               <div className="ml-2">
                  <h1 className="font-bold text-lg">Roozan</h1>
                  <p className="text-gray-500 text-sm">8 post</p>
               </div>
            </div>
            <img
               src="https://imgs.search.brave.com/EZadOBu3F4kX3zsOvJP44m886qZS40_zCBoVXpx83Y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNi8w/My8yNy8xOC81NC90/ZWNobm9sb2d5LTEy/ODM2MjRfNjQwLmpw/Zw"
               alt="Photo"
            />
            <div className="realtive -top-20 border-4 border-white rounded-full">
               <Avatar
                  src="https://imgs.search.brave.com/JGCZZygUlFTk8RW8L5uyeuIACCp0BsQI8IhaYyZmS4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZGVtby9pbWFn/ZS91cGxvYWQvd18x/NTAsaF8xNTAsY19m/aWxsLGdfZmFjZSxy/X21heC9mcm9udF9m/YWNlLnBuZw"
                  size="120"
                  round={true}
               />
            </div>
         </div>
      </div>
   );
};

export default Profile;
