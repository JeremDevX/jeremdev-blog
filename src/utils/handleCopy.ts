export const handleCopy = ({
  ref,
  getValue,
  onSuccess,
  onError,
}: {
  ref: React.RefObject<HTMLElement>;
  getValue: (ref: React.RefObject<HTMLElement>) => string;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  if (ref.current) {
    const valueToCopy = getValue(ref);
    if (valueToCopy.length > 0) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(valueToCopy)
          .then(() => {
            if (onSuccess) onSuccess();
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
            if (onError) onError();
          });
      } else {
        // Fallback for navigators that don't support clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = valueToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          if (onSuccess) onSuccess();
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
          if (onError) onError();
        }
        document.body.removeChild(textArea);
      }
    }
  }
};
