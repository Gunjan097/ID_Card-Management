// src/components/FormField.jsx
const FormField = ({ label, name, type = "text", value, onChange, options = [], accept }) => {
  return (
    <div className="flex items-center space-x-4">
      <label htmlFor={name} className="w-40 text-gray-700 font-medium">
        {label}:
      </label>

      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="flex-1 border rounded p-2"
        >
          <option value="">Select {label}</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === "file" ? (
        <input
          id={name}
          name={name}
          type="file"
          accept={accept}
          onChange={onChange}
          className="flex-1 border rounded p-2"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="flex-1 border rounded p-2"
        />
      )}
    </div>
  );
};

export default FormField;
