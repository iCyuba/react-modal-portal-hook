import React, { useState } from "react";
import Modal from "./BasicModal";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal open={open} close={() => setOpen(false)} />
    </>
  );
}

export default App;
