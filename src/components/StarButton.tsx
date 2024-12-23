import React from "react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { PiSpinnerGap } from "react-icons/pi";

type Props = {
  selected: boolean;
  loading: boolean;
};

export default function StarButton({ selected, loading }: Props) {
  return (
    <div className="relative hover:opacity-80 transition cursor-pointer">
      {!loading ? (
        <>
          <FaRegStar
            size={32}
            className="fill-white absolute -top-[2px] -right-[2px]"
          />
          <FaStar
            size={28}
            className={selected ? "fill-yellow-200" : "fill-neutral/70"}
          />
        </>
      ) : (
        <PiSpinnerGap size={32} className="fill-white animate-spin" />
      )}
    </div>
  );
}
