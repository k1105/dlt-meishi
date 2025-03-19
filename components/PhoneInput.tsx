import Select from "react-select";
import styles from "@/pages/Home.module.scss";
import {Dispatch, SetStateAction} from "react";

const countryOptions = [
  {value: "+81", label: "🇯🇵 +81 (Japan)"},
  {value: "+1", label: "🇺🇸 +1 (USA)"},
  {value: "+44", label: "🇬🇧 +44 (UK)"},
  {value: "+49", label: "🇩🇪 +49 (Germany)"},
  {value: "+33", label: "🇫🇷 +33 (France)"},
];

interface PhoneInputProps {
  phone: {countryCode: string; number: string};
  setPhone: Dispatch<
    SetStateAction<{
      countryCode: string;
      number: string;
    }>
  >;
}

export default function PhoneInput({phone, setPhone}: PhoneInputProps) {
  // ハイフンを挿入する関数
  const formatPhoneNumber = (number: string) => {
    let formattedNumber = number.replace(/\D/g, ""); // 数字以外を削除

    if (phone.countryCode === "+81") {
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
    setPhone((prev) => ({
      countryCode: prev.countryCode,
      number: e.target.value,
    }));
  };

  const handleBlur = () => {
    const formattedNumber = formatPhoneNumber(phone.number);
    setPhone((prev) => ({
      countryCode: prev.countryCode,
      number: formattedNumber,
    }));
  };

  return (
    <label>
      <p className={styles.label}>
        Tel <small>電話番号</small>
      </p>
      <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
        <Select
          options={countryOptions}
          value={countryOptions.find((opt) => opt.value === phone.countryCode)}
          onChange={(selected) => {
            const newCode = selected?.value || "+81";
            setPhone((prev) => ({
              countryCode: newCode,
              number: prev.number,
            }));
          }}
          styles={{
            container: (base) => ({...base, width: "300px", fontSize: "1rem"}),
          }}
        />
        <input
          className={styles.inputForm}
          type="tel"
          value={phone.number}
          onChange={handlePhoneChange}
          onBlur={handleBlur} // フォーカスが外れたときにフォーマット適用
          placeholder="例: 80-1234-5678"
          required
        />
      </div>
    </label>
  );
}
