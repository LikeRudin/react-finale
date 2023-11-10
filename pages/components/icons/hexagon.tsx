type HexagonProps = {
  className: string;
};

const HexagonIcon = ({ className }: HexagonProps) => (
  <svg
    viewBox='0 0 24 24'
    className={className}
    fill='none'
    stroke='currentColor'
    xmlns='http://www.w3.org.2000/svg'
  >
    <path
      stroke='round'
      strokeLinejoin='round'
      strokeWidth={0.8}
      d='M12.002 0a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm8.54 4.931a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm0 9.862a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm-8.54 4.931a2.138 2.138 0 100 4.276 2.138 2.138 0 100-4.276zm-8.542-4.93a2.138 2.138 0 100 4.276 2.138 2.138 0 100-4.277zm0-9.863a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm8.542-3.378L2.953 6.777v10.448l9.049 5.224 9.047-5.224V6.777zm0 1.601l7.66 13.27H4.34zm-1.387.371L3.97 15.037V7.363zm2.774 0l6.646 3.838v7.674zM5.355 17.44h13.293l-6.646 3.836z'
    />
  </svg>
);

export default HexagonIcon;
