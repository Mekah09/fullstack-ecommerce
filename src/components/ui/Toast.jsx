import { FiCheckCircle, FiX } from "react-icons/fi";

export default function Toast({ message, onDismiss }) {
  return (
    <div className="toast" role="status">
      <FiCheckCircle />
      <span>{message}</span>
      <button onClick={onDismiss} aria-label="Dismiss notification">
        <FiX />
      </button>
    </div>
  );
}
