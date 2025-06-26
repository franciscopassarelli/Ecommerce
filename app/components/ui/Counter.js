"use client";
import Boton from "./Boton";

const Counter = ({ counter, setCounter, max }) => {
  const increase = () => {
    if (max === 0) return;
    if (counter < max) setCounter(counter + 1);
  };

  const decrease = () => {
    if (max === 0) return;
    if (counter > 1) setCounter(counter - 1);
  };

  const isDisabled = max === 0;

  return (
    <div className="flex items-center gap-3">
      <Boton
        onClick={decrease}
        className="px-3 py-1 md:px-4 md:py-2 active:bg-blue-600 disabled:opacity-50"
        disabled={isDisabled || counter <= 1}
        aria-label="Disminuir cantidad"
      >
        -
      </Boton>
      <p className="text-lg md:text-xl w-8 text-center select-none">
        {isDisabled ? 0 : counter}
      </p>
      <Boton
        onClick={increase}
        className="px-3 py-1 md:px-4 md:py-2 active:bg-blue-600 disabled:opacity-50"
        disabled={isDisabled || counter >= max}
        aria-label="Aumentar cantidad"
      >
        +
      </Boton>
    </div>
  );
};

export default Counter;
