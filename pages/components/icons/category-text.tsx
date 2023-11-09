type CategoryText = {
  text: string;
};

const CategoryTextIcon = ({ text }: CategoryText) => {
  return (
    <span className='flex ml-4 items-center px-2.5 py-0.5  text-xs font-medium text-gray-800 bg-white rounded-lg'>
      {text}
    </span>
  );
};

export default CategoryTextIcon;
