import { useRef } from "react";

function NameInput() {
  const ref = useRef<HTMLInputElement>(null);

  const log = () => {
    console.log(ref);
    if (ref.current) {
      ref.current.value = "123";
    }
    // equivalent to document.getElementById('test').value = '123'
  };
  return (
    <>
      Name:
      <input
        type="text"
        ref={ref}
        //way to get reference o the element in the DOM
      />
      <button onClick={log}>Log</button>
    </>
  );
}

export default NameInput;
