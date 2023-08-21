import React, { useRef } from "react";
import { createPortal } from "react-dom";
import useModal from "../src/index";

interface ModalProps {
  open: boolean;
  close: () => void;
}

function Modal({ open, close }: ModalProps) {
  // Create a ref to the modal element
  // This is for accessibility purposes (it will be automatically focused when open)
  const modalRef = useRef<HTMLDivElement>(null);

  // Get the portal element from the hook
  // This handles focus for us automatically (that's the whole point of this library)
  // We do have to pass the ref to the modal element though (without this, tools like VoiceOver won't jump to the modal and will get stuck)
  const portal = useModal(open, modalRef.current);

  // To avoid issues with SSR this only creates the element on the client.
  // Because of that we need to check if the element exists before rendering.
  // We can also check for the open state to avoid rendering the element at all when it is closed.

  // Note: This intentionally doesn't remove the portal element from the DOM
  // You can also combine this with a transition to make it look nice (since we can mount the element even while passing false to the hook)
  if (!portal || !open) return null;

  return createPortal(
    // Our modal content
    <div ref={modalRef}>
      <button onClick={close}>Close modal</button>
    </div>,

    // Render into the element returned from the hook
    portal
  );
}

export default Modal;
