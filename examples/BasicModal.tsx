import React from "react";
import { createPortal } from "react-dom";
import useModal from "../src/index";

interface ModalProps {
  open: boolean;
  close: () => void;
}

function Modal({ open, close }: ModalProps) {
  // Get the portal element from the hook and pass the open state to it
  // Here it's desired to auto-focus the first child element of the portal element so I'm omitting the 2nd argument
  const portal = useModal(open);

  // The hook returns null on the server and on first render
  // Make sure to handle that case (such as by returning null)
  if (!portal || !open) return null;

  // Use React's createPortal to render the modal into the portal element
  return createPortal(
    <div aria-modal className="modal">
      <h2>Modal</h2>

      <button onClick={close}>Close modal</button>
    </div>,

    // This is the element returned by useModal
    portal
  );
}

export default Modal;
