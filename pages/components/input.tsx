import type { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  type: string;
  register: UseFormRegisterReturn;
  required: boolean;
  placeholder: string;
  setValue: UseFormSetValue<Text>;
  value: string;
}

const Input = ({
  label,
  name,
  type,
  register,
  required,
  placeholder,
  setValue,
  value,
}: InputProps) => {
  if (setValue) {
    setValue(name, value);
  }
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(name, e.target.value);
  };
  return (
    <>
      <label htmlFor={name} className="text-sm font-medium text-gray-[650]">
        {label}
      </label>
      <div>
        <input
          id={name}
          type={type}
          required={required}
          {...register}
          className="appearance-none w-full px-2 py-2 border border-orange-900 border-opacity-30 rounded-md shadow-sm placeholder-orange-800 focus:outline-none focus:ring-orange-400 focus:border-orange-800 placeholder:text-gray-400 text-gray-800"
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default Input;
