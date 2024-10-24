export const handleEnterKeyDown = (
  event: React.KeyboardEvent,
  callBack: () => void
) => {
  if (event.key === "Enter") {
    callBack();
  }
};
