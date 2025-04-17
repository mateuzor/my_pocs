import { useEffect, useRef } from "react";
import Observer from "../IntersectionObserver/Observer";

const LazyComponent = ({ type, ...props }) => {
  const lazyRef = useRef(null);

  useEffect(() => {
    if (lazyRef.current) {
      //here is the logic to observe each image
      Observer.observe(lazyRef.current);
    }
  }, [lazyRef]);
  return <img ref={lazyRef} {...props} />;
};

export default LazyComponent;
