import { forwardRef } from 'react';

const FormField = forwardRef(({ label, error, type = 'text', className = '', ...props }, ref) => {
  const inputClasses = `form-input ${error ? 'border-red-500' : ''} ${className}`;

  return (
    <div className="mb-4">
      {label && <label className="form-label mb-1">{label}</label>}
      {type === 'textarea' ? (
        <textarea ref={ref} className={inputClasses} {...props} />
      ) : (
        <input ref={ref} type={type} className={inputClasses} {...props} />
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
