export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[color:var(--bb-text)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </label>
  );
}
