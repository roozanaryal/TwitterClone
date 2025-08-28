import { createContext, useContext } from "react";

const PostFocusContext = createContext({ focusPostInput: () => {} });

export const usePostFocus = () => useContext(PostFocusContext);
export { PostFocusContext };
