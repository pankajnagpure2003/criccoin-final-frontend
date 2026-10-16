import { useState } from "react";

export default function PasswordField({ name, placeholder, value, onChange, required = true }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-wrap">
      <input
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button type="button" className="eye-btn" onClick={() => setVisible((v) => !v)} aria-label="Toggle password">
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
