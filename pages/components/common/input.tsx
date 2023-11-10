import type { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";
import React, { useEffect } from "react";

interface InputProps {
  label: string;
  name: string;
  type: string;
  register: UseFormRegisterReturn;
  required: boolean;
  placeholder: string;
  setValue: UseFormSetValue<any>;
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
    if (value) {
      setValue(name, value);
    }
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, e.target.value);
  };

  return (
    <>
      {type === "file" ? (
        <label
          htmlFor={name}
          className='w-full h-48  flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:text-orange-600 cursor-pointer'
        >
          <svg
            className='h-12 w-12'
            stroke='currentColor'
            fill='none'
            viewBox='0 0 48 48'
            aria-hidden='true'
          >
            <path
              d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
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
