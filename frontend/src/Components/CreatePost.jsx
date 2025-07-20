import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";


const CreatePost = () => {
   return (
      <div className="w-[100%]">
         <div>
            <div className="flex items-center justify-evenly border-b border-gray-200">
               <div className="cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3">
                  <h1 className="font-semibold text-gray-600 text-lg">
                     For You
                  </h1>
               </div>
               <div className="cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3">
                  <h1 className="font-semibold text-gray-600 text-lg">
                     Following
                  </h1>
               </div>
            </div>
            <div className="flex items-center p-4">
               <div>
                  <Avatar
                     src="https://imgs.search.brave.com/JGCZZygUlFTk8RW8L5uyeuIACCp0BsQI8IhaYyZmS4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZGVtby9pbWFn/ZS91cGxvYWQvd18x/NTAsaF8xNTAsY19m/aWxsLGdfZmFjZSxy/X21heC9mcm9udF9m/YWNlLnBuZw"
                     size="40"
                     round={true}
                  />
               </div>
               <input
                  type="text"
                  className="w-full outline-none border-none text-xl ml-2"
                  placeholder="What is happening?!"
               />
            </div>
            <div className="flex items-center justify-between p-4 border-b border-gray-300" >
               <div>
                  <CiImageOn size="24px" />
               </div>
               <button className="bg-[#1D9BF0] px-4 py-1 text-lg text-white text-right border-none rounded-full">
                  Post
               </button>
            </div>
         </div>
      </div>
   );
};

export default CreatePost;
