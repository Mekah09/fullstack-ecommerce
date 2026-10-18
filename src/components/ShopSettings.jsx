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
          <input readOnly value={user?.email || "seller@nook.example"} />
        </label>
        <p className="dash-settings-note">
          Shop settings are a frontend preview. Connect your backend to save
          changes to your account.
        </p>
        <button type="submit" className="dash-primary">
          Save shop details
          <FiCheck />
        </button>
      </form>
    </section>
  );
}
