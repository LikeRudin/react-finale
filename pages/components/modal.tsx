import type { MouseEvent, ReactNode } from "react";
import cls from "@/libs/util/cls";

const Modal = ({
  trigger,
  children,
  onClickTrigger,
}: {
  onClickTrigger: (e: MouseEvent) => void;
  trigger: boolean;
  children: ReactNode;
}) => {
  return (
    <div
      className={cls(
        trigger
          ? "fixed top-0 left-0 h-screen w-screen bg-black/50 z-20 flex justify-center items-center"
          : "hidden"
      )}
      onClick={onClickTrigger}
    >
      {children}
    </div>
  );
};
export default Modal;
