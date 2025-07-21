import { createContext, useContext, useRef } from "react";

const PostFocusContext = createContext({ focusPostInput: () => {} });

export const usePostFocus = () => useContext(PostFocusContext);

export const PostFocusProvider = ({ children }) => {
  const focusFn = useRef(() => {});
  return (
    <PostFocusContext.Provider value={{
      setFocusFn: (fn) => { focusFn.current = fn; },
      focusPostInput: () => { focusFn.current(); }
    }}>
      {children}
    </PostFocusContext.Provider>
  );
};
