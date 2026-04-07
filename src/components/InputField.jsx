export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  disabled = false,
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
        disabled={disabled}
        className="input-field w-full"
      />
    </label>
  );
}
