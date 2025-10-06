/** @format */

export interface InputProps {
  reference?: any;
  placeholder: string;
  fullWidth?: string;
  type?: string;
}

export function Input({reference, placeholder, type = "text", fullWidth}: InputProps) {

  return (
    <>
      <input
        ref={reference}
        placeholder={placeholder}
        type={type}
        className={`px-4 py-2 border border-all-t rounded-2xl m-1 ${fullWidth ? 'w-full' : ''}`}
      />
    </>
  );
}
