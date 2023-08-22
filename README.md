# React Modal Portal Hook

A simple hook for creating portals for modals in React.

This uses the [inert property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert) to disable all elements outside of the modal.
Make sure this is supported in your target browsers.

_Note: Currently, only an ESM build targetting ES2015 is provided_

For now, published versions will be on my private registry. You can install it with:

```bash
npm config set @icyuba:registry https://npm.icy.cx --location project
npm install @icyuba/react-modal-portal-hook
```

## Bundle size

This library is very small and only depends on React.

Here's the size of each file (only compressed, unmangled, ungzipped):

- `index.js`: ~1.5kb (also re-exports usePortal and depends on it)
- `usePortal.js`: ~0.5kb

_You can go even smaller by using a minifier and gzip._

## Usage

### useModal

The primary hook exported by this library is `useModal`.

It takes two arguments:

- `open`: A boolean indicating if the modal is open or not
- `focus`: (Optional) A ref to the element that should be focused by default when the modal is opened

_Note: After opening, the first child of the modal will be focused by default. This can be overridden by passing a ref to the element that should be focused._

_Note 2: The open argument is only for controlling focus. You can still render the modal element even when passing in false. This is useful for transitions._

And returns a portal element that should be used by React's `createPortal` function. (Same as the `usePortal` hook!)

Behind the scenes, this hook will add the `inert` property to all elements outside of the modal (only direct children of body). This will prevent them from being focused or interacted with.

When the modal is closed, the `inert` property will be removed from all elements and added to the portal element. Focus will be restored to the element that was focused before the modal was opened.

### usePortal

This hook is exported for convenience. It is used internally by `useModal` and can be used to create portals for other things.

All it does is create a new div element and append it to the body. It doesn't handle focus or anything else. (That's what `useModal` is for!)

The div gets removed from the DOM when the component unmounts.

### Example

Basic modal component with this hook:

```jsx
function Modal({ open, close }) {
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
```

This example can be found here written in TypeScript: [examples/BasicModal.tsx](https://github.com/iCyuba/react-modal-portal-hook/blob/main/examples/BasicModal.tsx)

You can run it in the browser by cloning this repo and running `pnpm dev`.
This dev build will also include some informational logs in the console, check them out to see how the hook works.

## Comparison to the dialog element

The [dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) is meant to be used for modals. But imo it's not very good.

While it's very convenient to use, it doesn't support exit animations and it's not very customizable.

This hook is meant to be used for modals that need to be more customizable and have exit animations.

Also I encountered an issue with inheritance of css variables on the backdrop pseudo-element. Using regular old divs doesn't have this issue.
