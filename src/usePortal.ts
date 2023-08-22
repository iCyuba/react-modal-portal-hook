import { useEffect, useState } from "react";

/**
 * Hook for creating an element for a react portal.
 *
 * This should stay mounted to the DOM at all times. (unless the component which calls this hook is unmounted obv)
 *
 * @returns The element to use as a portal.
 */
function usePortal() {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create the component that will be mounted to the DOM
    // Initialized after the first render on the client (as document isn't defined on the server)
    const element = document.createElement("div");

    // Add the element to the DOM
    document.body.appendChild(element);

    console.log("[usePortal] Element added to the dom", element);

    // Store the element in a state
    setElement(element);

    // On unmount, remove the element from the DOM
    return () => {
      console.log("[usePortal] Removing element from DOM");

      document.body.removeChild(element);
    };
  }, []);

  return element;
}

export default usePortal;
