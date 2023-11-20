import { useState } from "react";

const useChangeBoolean = (init: boolean) => {
  const [state, setState] = useState(init);

  const change = (value?: boolean) =>
    setState((prev) => (typeof value === "boolean" ? value : !prev));
  return { state, change };
};

export default useChangeBoolean;
