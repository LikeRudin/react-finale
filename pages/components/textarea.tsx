import type { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";

interface TextAreaProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn;
  setValue?: UseFormSetValues<Text>;
  required: boolean;
  placeholder?: string;
  value: string;
}

const TextArea = ({
  label,
  name,
  register,
  placeholder,
  required = true,
  setValue,
  value,
}: TextAreaProps) => {
  if (setValue) {
    setValue(name, value);
  }
  const onChange = (e) => {
    const value = setValue(name, e.target.value);
  };

  return (
    <div className=" mt-2">
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-800"
      >
        {label}
      </label>
      <div>
        <textarea
          id={name}
          rows={4}
          className="mt-1 shaodw-sm w-full focus:ring-orange-800 focus:ring-2 focus:ring-offset-1  rounded-md  border-gray-400 focus:border-transparent"
          required={required}
          placeholder={placeholder}
          {...register}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default TextArea;
