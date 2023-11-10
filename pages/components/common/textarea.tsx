import React, { useEffect } from "react";
import type { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";

interface TextAreaProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn;
  setValue: UseFormSetValue<any>;
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
  useEffect(() => {
    if (value) {
      setValue(name, value);
    }
  });
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(name, e.target.value);
  };

  return (
    <div className='mt-2 h-full'>
      <label htmlFor={name} className='mb-1 block text-sm font-medium '>
        {label}
      </label>
      <div>
        <textarea
          id={name}
          rows={4}
          className='text-gray-800 mt-1 shaodw-sm w-full focus:ring-orange-800 focus:ring-2 focus:ring-offset-1  rounded-md  border-gray-400 focus:border-transparent'
          required={required}
          placeholder={placeholder}
          {...register}
          onChange={onChange}
          defaultValue={value}
        ></textarea>
      </div>
    </div>
  );
};

export default TextArea;
