import React, { useState } from "react";
import Modal from "./BasicModal";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <h3>All these buttons trigger the same modal</h3>
      <p>Notice how the focus returns to the one you open the modal with</p>

      <button onClick={() => setOpen(true)}>Open modal</button>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <button onClick={() => setOpen(true)}>Open modal</button>

      <Modal open={open} close={() => setOpen(false)} />
    </>
  );
}

export default App;
