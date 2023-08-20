import { useEffect, useRef } from "react";

import usePortal from "./usePortal";

/**
 * Hook for a modal portal element.
 *
 * Use the returned element as the portal for the modal.
 *
 * When open is true, all other elements in the body will be set to not be tabbable (using the inert property).
 * After the modal is closed, they are restored to their original state.
 *
 * When focus is set, the element will be focused when the modal is opened.
 * After closing, the focus will be restored to the element that was focused before opening the modal.
 *
 * Note: Adding interactive components to the body **after** the modal is open will not make them inert.
 *       Please avoid doing this. If you need to, you can use the `inert` property on the element manually.
 *
 * @param open Whether the modal should be open or not.
 * @param focus The element to focus when the modal is opened.
 * @returns The portal element. (will be null on the server and first render)
 */
function useModal(open: boolean, focus?: HTMLElement | null) {
  const element = usePortal();

  // Remember which elements were changed
  const inertElements = useRef<HTMLElement[]>([]);

  // Remember the old focus (null => no focus before opening, undefined => focus not saved yet)
  const oldFocus = useRef<HTMLElement | null | undefined>(undefined);

  // When the modal is open, make all the elements in the body inert
  // This prevents the user from tabbing to elements outside of the modal
  // After the modal is closed, they are restored to their original state
  useEffect(() => {
    if (!element) return; // There can be no modal without a portal...

    if (open) {
      // Save the old focused element
      oldFocus.current = document.querySelector<HTMLElement>(":focus");

      // Set all elements in the body to inert (skip already inert elements [to avoid errors with multiple modals])
      const elements = document.body.querySelectorAll<HTMLElement>(
        "body > *:not([inert])"
      );

      elements.forEach((el) => {
        // Skip the modal portal (obviously)
        if (el === element) return;

        el.inert = true;

        // Add the element to the list of changed elements
        // This is used to restore the elements to their original state later
        inertElements.current.push(el);
      });
    } else {
      // Restore the elements to their original state (remove the inert property)
      inertElements.current.forEach((el) => {
        el.inert = false;
      });

      // Restore the old focus and clear the ref
      if (oldFocus.current) oldFocus.current.focus();
      oldFocus.current = undefined;

      // Clear the list of changed elements
      inertElements.current = [];
    }
  }, [open, element]);

  useEffect(() => {
    // After opening (and the old focus is saved), focus the new element
    if (open && oldFocus.current !== undefined && focus) {
      // Save the old tab index
      const oldTabIndex = focus.tabIndex;

      // Make sure the element is focusable (by setting the tab index to 0)
      focus.tabIndex = 0;
      focus.focus();

      // Restore the old tab index
      focus.tabIndex = oldTabIndex;
    }
  }, [open, focus]);

  // Return the element that will be mounted to the DOM
  return element;
}

export default useModal;
