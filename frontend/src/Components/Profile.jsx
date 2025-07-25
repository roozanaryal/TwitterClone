import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
const dummyPosts = [
  {
    id: 1,
    description: "My first post!",
    content: "Excited to join TwitterClone.",
  },
  {
    id: 2,
    description: "Second post",
    content: "Loving the UI and features!",
  },
  {
    id: 3,
    description: "Web dev journey",
    content: "Learning React and Node.js is fun.",
  },
];

const Profile = () => {
  return (
    <div className="px-4">
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
          className="h-[33vh] w-full"
          src="https://imgs.search.brave.com/EZadOBu3F4kX3zsOvJP44m886qZS40_zCBoVXpx83Y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNi8w/My8yNy8xOC81NC90/ZWNobm9sb2d5LTEy/ODM2MjRfNjQwLmpw/Zw"
          alt="Photo"
        />
        <div className="absolute top-52 ml-2 border-4 border-white rounded-full">
          <Avatar
            src="https://imgs.search.brave.com/JGCZZygUlFTk8RW8L5uyeuIACCp0BsQI8IhaYyZmS4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZGVtby9pbWFn/ZS91cGxvYWQvd18x/NTAsaF8xNTAsY19m/aWxsLGdfZmFjZSxy/X21heC9mcm9udF9m/YWNlLnBuZw"
            size="120"
            round={true}
          />
        </div>
        <div className="text-right m-4">
          <button className="px-4 py-1 hover:bg-gray-200 rounded-full text-right border border-gray-400">
            Edit Profiles
          </button>
        </div>
        <div className="m-4">
          <h1 className="font-bold text-xl">Roozan</h1>
          <p>@roozanaryal</p>
        </div>
        <div className="m-4 text-sm">
          <p>Exploring the web&apos;s endless possibility</p>
        </div>
        {/* User's Posts */}
        <div className="m-4">
          <h2 className="font-bold text-lg mb-2">Posts</h2>
          {dummyPosts.map((post) => (
            <div key={post.id} className="border-b border-gray-200 py-3">
              <h3 className="font-semibold">{post.description}</h3>
              <p className="text-gray-700">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
