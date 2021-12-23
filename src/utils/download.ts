/**
 * Creates a download for the user immediately upon call.
 */
export const download = (path: string, filename: string) => {
  // Create a new link
  const anchor = document.createElement('a');
  anchor.href = path;
  anchor.download = filename;

  // Append to the DOM
  document.body.appendChild(anchor);

  // Trigger `click` event
  anchor.click();

  // Remove element from DOM
  document.body.removeChild(anchor);
};
