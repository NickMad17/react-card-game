import { useEffect } from "react";

export const useClose = (ref, callback) => {
  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (e.target !== ref.current){
        callback()
      }
    });
    return () => {
      document.removeEventListener("click", (e) => {
        if (e.target !== ref.current){
          callback()
        }
      });
    };
  }, []);
};