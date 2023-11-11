import type { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";
import React, { useEffect } from "react";
import EmptyImageIcon from "../icons/empty-image";

interface InputProps {
  label: string;
  name: string;
  type: string;
  register: UseFormRegisterReturn;
  required: boolean;
  placeholder?: string;
  setValue?: UseFormSetValue<any>;
  value?: string;
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
  useEffect(() => {
    if (value && setValue) {
      setValue(name, value);
    }
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) setValue(name, e.target.value);
  };

  return (
    <>
      {type === "file" ? (
        <label
          htmlFor={name}
          className='w-full h-48  flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:text-orange-600 cursor-pointer'
        >
          <EmptyImageIcon className='w-12 h-12' />
          <input
            {...register}
            type={type}
            required={required}
            className='hidden'
          />
        </label>
      ) : (
        <>
          <label htmlFor={name} className='text-sm font-medium text-gray-[650]'>
            {label}
          </label>
          <div>
            <input
              id={name}
              type={type}
              required={required}
              {...register}
              className='appearance-none w-full px-2 py-2 border border-orange-900 border-opacity-30 rounded-md shadow-sm placeholder-orange-800 focus:outline-none focus:ring-orange-400 focus:border-orange-800 placeholder:text-gray-400 text-gray-800'
              placeholder={placeholder}
              onChange={onChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Input;
