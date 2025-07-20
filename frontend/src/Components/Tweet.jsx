import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";

const Tweet = () => {
   return (
      <div className="border-b border-gray-200">
         <div>
            <div className="flex p-4">
               <Avatar
                  src="https://imgs.search.brave.com/JGCZZygUlFTk8RW8L5uyeuIACCp0BsQI8IhaYyZmS4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZGVtby9pbWFn/ZS91cGxvYWQvd18x/NTAsaF8xNTAsY19m/aWxsLGdfZmFjZSxy/X21heC9mcm9udF9m/YWNlLnBuZw"
                  size="40"
                  round={true}
               />
               <div className="ml-2">
                  <div className="flex items-center ml-2">
                     <h1 className="font-bold">Roozan Aryal</h1>
                     <p className="text-gray-500 text-sm ml-1">
                        @roozan_aryal . 1m
                     </p>
                  </div>
                  <div>
                     <p>Hello Developers lets Connect</p>
                       </div>
                       <div  className='flex justify-between my-3' >
                       <div className='flex items-center'>
                                <div className='p-2 hover:bg-blue-200 rounded-full cursor-pointer'>
                                    <FaRegComment size="20px" />
                                </div>
                                <p>0</p>
                            </div>
                            <div className='flex items-center'>
                                <div className='p-2 hover:bg-red-200 rounded-full cursor-pointer'>
                                    <CiHeart size="20px" />
                                </div>
                                <p>0</p>
                           </div>
                           <div className='flex items-center'>
                                <div className='p-2 hover:bg-blue-200 rounded-full cursor-pointer'>
                                    <CiBookmark size="20px" />
                                </div>
                                <p>0</p>
                            </div>
                       </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Tweet;
