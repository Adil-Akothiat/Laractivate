import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  bordered?: boolean;
  ghost?: boolean;
  wrapperClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  errorText,
  bordered = true,
  ghost = false,
  wrapperClassName = "",
  className = "",
  id,
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const hasError = !!errorText;

  const textareaClasses = [
    "textarea",
    "w-full",
    bordered ? "textarea-bordered" : "",
    ghost ? "textarea-ghost" : "",
    hasError ? "textarea-error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`form-control w-full ${wrapperClassName}`}>
      {label && (
        <label className="label" htmlFor={textareaId}>
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <textarea id={textareaId} className={textareaClasses} {...props} />
      {(helperText || errorText) && (
        <label className="label">
          <span
            className={`label-text-alt ${hasError ? "text-error" : "text-base-content/60"}`}
          >
            {errorText || helperText}
          </span>
        </label>
      )}
    </div>
  );
};

export default Textarea;
