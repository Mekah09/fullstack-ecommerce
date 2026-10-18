import { FiCheck } from "react-icons/fi";

export default function ShopSettings({
  shopName,
  user,
  onShopNameChange,
  onSave,
}) {
  return (
    <section className="dash-panel dash-settings">
      <div className="dash-panel-title">
        <div>
          <h2>Shop details</h2>
          <p>A warm welcome starts with the little things.</p>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <label>
          Shop name
          <input
            required
            value={shopName}
            maxLength={60}
            onChange={(event) => onShopNameChange(event.target.value)}
          />
        </label>
        <label>
          Contact email
          <input
            readOnly
            value={user?.email || ""}
            placeholder="No contact email provided"
          />
        </label>
        <p className="dash-settings-note">
          The shop name applies to this browser session. Account settings will
          need a profile endpoint to save changes to your account.
        </p>
        <button type="submit" className="dash-primary">
          Apply for this session
          <FiCheck />
        </button>
      </form>
    </section>
  );
}
