# React Modal Portal Hook

A simple hook for creating portals for modals in React.

This uses the [inert property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert) to disable all elements outside of the modal.
Make sure this is supported in your target browsers.

_Note: There won't be a build for Common Js._

For now, published versions will be on my private registry. You can install it with:

```bash
npm config set @icyuba:registry https://npm.icy.cx --location project
npm install @icyuba/react-modal-portal-hook
```

## Bundle size

This library is very small and only depends on React.

Here's the size of each file (only compressed, unmangled, ungizipped):

- `index.js`: ~1kb (also re-exports usePortal and depends on it)
- `usePortal.js`: ~0.5kb

## Usage

Basic modal component with this hook:

```jsx
function Modal({ open, close }) {
  // Create a ref to the modal element
  // This is for accessibility purposes (it will be automatically focused when open)
  const modalRef = useRef(null);

  // Get the portal element from the hook
  // This handles focus for us automatically (that's the whole point of this library)
  // We do have to pass the ref to the modal element though (without this, tools like VoiceOver won't jump to the modal and will get stuck)
  const portal = useModal(open, modalRef;

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
```

This example can be found here written in TypeScript: [examples/BasicModal.tsx](https://github.com/iCyuba/react-modal-portal-hook/blob/main/examples/BasicModal.tsx)
