interface ButtonProps {
  tooltip: string;
}

const Button = ({ tooltip }: ButtonProps) => {
  return (
    <div className="fixed bottom-24 right-2 w-[124px] ">
      <button className="group w-full flex-col items-center justify-center">
        <div className="absolute bottom-[115%] right-[5%] bg-gray-200  w-full h-6 rounded-md hidden group-hover:block break-none">
          <div className="flex items-center justify-center w-full px-2 font-medium text-medium text-orange-400 ">
            {tooltip}
          </div>
        </div>
        <div className="flex items-center justify-center w-14 h-14 relative  group-hover:bg-orange-700 transition-colors cursor-pointer  shadow-xl bg-orange-600 rounded-full p-4 text-white font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default Button;
