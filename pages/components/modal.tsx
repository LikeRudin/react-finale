// const Overlay = styled(motion.div)`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.6);
//   z-index: 3;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

import type { ReactNode } from "react";

const Modal = (children: ReactNode) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0, 0, 0, 0.6)] z-3 flex justify-center items-center">
      {children}
    </div>
  );
};
export default Modal;
