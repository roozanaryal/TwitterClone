import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import { useRef, useEffect, useState } from "react";
import { usePostFocus } from "../context/PostFocusContext";

const CreatePost = () => {
   const inputRef = useRef(null);
   const { setFocusFn } = usePostFocus();
   const [isFocused, setIsFocused] = useState(false);
   const [description, setDescription] = useState("");
   // const [content, setContent] = useState("");

   useEffect(() => {
      setFocusFn(() => () => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Select all text or place cursor at end for immediate typing
          const val = inputRef.current.value;
          inputRef.current.value = '';
          inputRef.current.value = val;
        }
      });
   }, [setFocusFn]);

   const handleSubmit = (e) => {
      e.preventDefault();
      // TODO: submit to backend
      

   };
   return (
      <div className="w-[100%]">
         <form onSubmit={handleSubmit}>
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
            <div className="flex items-center p-4 bg-white">
               <div>
                  <Avatar
                     src="https://imgs.search.brave.com/JGCZZygUlFTk8RW8L5uyeuIACCp0BsQI8IhaYyZmS4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZGVtby9pbWFn/ZS91cGxvYWQvd18x/NTAsaF8xNTAsY19m/aWxsLGdfZmFjZSxy/X21heC9mcm9udF9m/YWVlLnBuZw"
                     size="40"
                     round={true}
                  />
               </div>
               <input
                  ref={inputRef}
                  type="text"
                  className="w-full outline-none border-none text-xl ml-2 bg-transparent"
                  placeholder="What is happening?!"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
               />
            </div>
            <div className="flex items-center justify-between p-4 border-b border-gray-300" >
               <div>
                  <CiImageOn size="24px" />
               </div>
               <button type="submit" className="bg-[#1D9BF0] px-4 py-1 text-lg text-white text-right border-none rounded-full">
                  Post
               </button>
            </div>
         </form>
      </div>
   );
};

export default CreatePost;
