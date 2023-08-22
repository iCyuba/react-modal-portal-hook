import { useEffect, useRef, type RefObject } from "react";

import usePortal from "./usePortal";

/** Re-export the usePortal hook (for convenience) */
export { default as usePortal } from "./usePortal";

/** Small helper to force focus on a given element */
function forceFocus(el: HTMLElement) {
  console.log("[useModal] Force focusing element", el);

  // Save the old tab index
  const oldTabIndex = el.tabIndex;

  // Make sure the element is focusable (by setting the tab index to 0)
  el.tabIndex = 0;
  el.focus();

  // Restore the old tab index
  el.tabIndex = oldTabIndex;
}

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
function useModal(
  open: boolean,
  focus?: HTMLElement | RefObject<HTMLElement> | null
) {
  const element = usePortal();

  // Remember which elements were changed
  const inertElements = useRef<HTMLElement[]>([]);

  // Remember the old focus (null => no focus before opening, undefined => focus not saved yet)
  const oldFocus = useRef<HTMLElement | null | undefined>(undefined);

  // When the modal is open, make all the elements in the body inert
  // This prevents the user from tabbing to elements outside of the modal
  // After the modal is closed, they are restored to their original state
  useEffect(() => {
    // There can be no modal without a portal...
    if (!element) return console.log("[useModal] No portal element, skipping");

    if (open) {
      // Save the old focused element
      oldFocus.current = document.querySelector<HTMLElement>(":focus");
      console.log("[useModal] Saving old focus", oldFocus.current);

      // Focus the first child of the modal (if there is one)
      if (element.firstElementChild instanceof HTMLElement)
        forceFocus(element.firstElementChild);

      // Set all elements in the body to inert (skip already inert elements [to avoid errors with multiple modals])
      document.body
        .querySelectorAll<HTMLElement>("body > :not([inert])")

        .forEach((el) => {
          // Skip the modal portal (obviously)
          if (el === element) return;

          el.inert = true;

          // Add the element to the list of changed elements
          // This is used to restore the elements to their original state later
          inertElements.current.push(el);
        });

      console.log("[useModal] Elements set to inert", inertElements.current);

      // Return a cleanup function that restores the elements
      return () => {
        console.log(
          "[useModal] Cleanup - Restoring elements",
          inertElements.current
        );

        // Restore the elements to their original state (remove the inert property)
        inertElements.current.forEach((el) => {
          el.inert = false;
        });

        // Restore the old focus and clear the ref
        console.log("[useModal] Restoring old focus", oldFocus.current);
        if (oldFocus.current) oldFocus.current.focus();
        oldFocus.current = undefined;

        // Clear the list of changed elements
        inertElements.current = [];
      };
    } else {
      console.log("[useModal] Setting self to inert");

      // When closed, add the inert property to the portal element
      element.inert = true;

      // Return a cleanup function that removes the inert property
      return () => {
        console.log("[useModal] Cleanup - Removing inert property from self");

        element.inert = false;
      };
    }
  }, [open, element, forceFocus]);

  useEffect(() => {
    // After opening (and the old focus is saved), focus the new element
    const el = focus instanceof HTMLElement ? focus : focus && focus.current;

    // Don't focus if the modal is closed, the element is not defined or the old focus is not saved
    if (element && open && oldFocus.current !== undefined && el) forceFocus(el);
  }, [element, open, focus, forceFocus]);

  // Return the element that will be mounted to the DOM
  return element;
}

export default useModal;
