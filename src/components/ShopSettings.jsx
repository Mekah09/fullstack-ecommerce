import { FiCheck } from "react-icons/fi";

export default function ShopSettings({
  shopName,
  user,
  onShopNameChange,
  onSave,
}) {
  return (
    <section className="dash-panel min-w-0 overflow-hidden rounded-xl border border-[#e4e8dd] bg-white dash-settings [&_form]:grid [&_form]:max-w-2xl [&_form]:gap-5 [&_form]:p-5 [&_label]:grid [&_label]:gap-2 [&_label]:text-xs [&_label]:font-medium [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-[#dce3d2] [&_input]:bg-white [&_input]:px-3 [&_input]:py-3 [&_input]:font-normal [&_input]:outline-[#789264] [&_input:read-only]:bg-[#f6f8f2] [&_input:read-only]:text-[#8d9880] [&_button]:justify-self-start">
      <div className="dash-panel-title flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0e7] p-5 [&_h2]:text-base [&_h2]:font-semibold [&_p]:mt-1 [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#8a947e]">
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
        <p className="dash-settings-note text-xs leading-6 text-[#8c9780]">
          The shop name applies to this browser session. Account settings will
          need a profile endpoint to save changes to your account.
        </p>
        <button type="submit" className="dash-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#234d39] px-5 py-3 text-xs font-medium text-white transition hover:bg-[#183e2b] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#769563] [&_svg]:size-4">
          Apply for this session
          <FiCheck />
        </button>
      </form>
    </section>
  );
}
