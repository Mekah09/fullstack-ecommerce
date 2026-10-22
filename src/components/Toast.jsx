import { FiCheckCircle, FiX } from "react-icons/fi";

export default function Toast({ message, onDismiss }) {
  return <div className="toast fixed bottom-5 left-1/2 z-[150] flex w-[calc(100%-32px)] max-w-md -translate-x-1/2 items-center gap-3 rounded-lg border border-[#dbe4d1] bg-[#fffefa] px-4 py-4 text-xs leading-5 text-[#31513c] shadow-xl" role="status"><FiCheckCircle className="h-5 w-5 shrink-0 text-[#7d985b]" aria-hidden="true" /><span className="flex-1">{message}</span><button className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-[#eef2e7]" onClick={onDismiss} aria-label="Dismiss notification"><FiX aria-hidden="true" /></button></div>;
}
