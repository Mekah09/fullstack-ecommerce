import { FiArrowRight } from "react-icons/fi";
import { LuSprout } from "react-icons/lu";
import Modal from "./Modal.jsx";

export default function InfoModal({ info, onClose }) {
  return (
    <Modal titleId="info-title" onClose={onClose} closeLabel="Close information">
      <LuSprout className="info-sprout mb-6 text-4xl text-[#8a9c6f]" />
      <span className="eyebrow text-[10px] font-semibold tracking-[0.2em] text-[#81916e]">A LITTLE ABOUT NOOK</span>
      <h2 id="info-title" className="mt-3 font-serif text-3xl sm:text-4xl">{info.title}</h2>
      <p className="my-5 text-sm leading-7 text-[#7c8871]">{info.text}</p>
      <button className="primary-button inline-flex items-center gap-4 rounded bg-[#234d39] px-5 py-3 text-sm text-white transition hover:bg-[#183e2b]" onClick={onClose}>Make yourself at home <FiArrowRight /></button>
    </Modal>
  );
}
