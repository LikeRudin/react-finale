type SubmitButtonProps = {
  text: string;
  className?: string;
};

const SubmitButton = ({ text, className }: SubmitButtonProps) => (
  <input
    value={text}
    type='submit'
    className={
      className ||
      "w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none"
    }
  />
);

export default SubmitButton;
