export default function ShippingAddressForm({ user }) {
  return (
    <div className="checkout-fields grid grid-cols-2">
      <label>
        Full name
        <input
          name="name"
          required
          defaultValue={user?.name}
          autoComplete="name"
          placeholder="Alex Morgan"
          data-initial-focus
        />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          required
          defaultValue={user?.email}
          autoComplete="email"
          placeholder="you@example.com"
        />
      </label>
      <label className="full-field">
        Street address
        <input
          name="address"
          required
          autoComplete="street-address"
          placeholder="Street address and apartment"
        />
      </label>
      <label>
        City
        <input
          name="city"
          required
          autoComplete="address-level2"
          placeholder="Your city"
        />
      </label>
      <label>
        Postal code
        <input
          name="postalCode"
          required
          autoComplete="postal-code"
          placeholder="Postal code"
        />
      </label>
    </div>
  );
}
