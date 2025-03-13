import { useState } from "react";
import Select from "react-select";

const countryOptions = [
  { value: "+81", label: "🇯🇵 +81 (Japan)" },
  { value: "+1", label: "🇺🇸 +1 (USA)" },
  { value: "+44", label: "🇬🇧 +44 (UK)" },
  { value: "+49", label: "🇩🇪 +49 (Germany)" },
  { value: "+33", label: "🇫🇷 +33 (France)" },
];

interface PhoneInputProps {
  setPhoneNumber: (phone: string) => void;
}

export default function PhoneInput({ setPhoneNumber }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState("+81");
  const [tel, setTel] = useState("");

  // ハイフンを挿入する関数
  const formatPhoneNumber = (number: string) => {
    let formattedNumber = number.replace(/\D/g, ""); // 数字以外を削除

    if (countryCode === "+81") {
      // 日本の電話番号フォーマット
      if (formattedNumber.startsWith("0")) {
        formattedNumber = formattedNumber.substring(1); // 先頭の0を削除
      }
      if (formattedNumber.length === 10) {
        // 固定電話
        return `${formattedNumber.slice(0, 2)}-${formattedNumber.slice(
          2,
          6
        )}-${formattedNumber.slice(6)}`;
      } else if (formattedNumber.length === 9) {
        // 携帯電話
        return `${formattedNumber.slice(0, 1)}-${formattedNumber.slice(
          1,
          5
        )}-${formattedNumber.slice(5)}`;
      }
    }
    // 他の国のフォーマット（必要に応じて追加）
    return formattedNumber;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTel(e.target.value);
  };

  const handleBlur = () => {
    const formattedNumber = formatPhoneNumber(tel);
    setTel(formattedNumber);
    setPhoneNumber(`${countryCode} ${formattedNumber}`);
  };

  return (
    <label>
      <strong>電話番号：</strong>
      <div style={{ display: "flex", gap: "10px" }}>
        <Select
          options={countryOptions}
          value={countryOptions.find((opt) => opt.value === countryCode)}
          onChange={(selected) => {
            const newCode = selected?.value || "+81";
            setCountryCode(newCode);
            const formattedNumber = formatPhoneNumber(tel);
            setPhoneNumber(`${newCode} ${formattedNumber}`);
          }}
          styles={{ container: (base) => ({ ...base, width: "150px" }) }}
        />
        <input
          type="tel"
          value={tel}
          onChange={handlePhoneChange}
          onBlur={handleBlur} // フォーカスが外れたときにフォーマット適用
          placeholder="例: 80-1234-5678"
          style={{ flex: 1, padding: "5px" }}
        />
      </div>
    </label>
  );
}
