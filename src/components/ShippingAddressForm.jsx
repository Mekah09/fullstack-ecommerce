export default function ShippingAddressForm({ user }) {
  return (
    <div className="checkout-fields grid grid-cols-1 gap-4 sm:grid-cols-2 [&_label]:block [&_label]:text-xs [&_label]:font-medium [&_label]:text-[#65745b] [&_input]:mt-2 [&_input]:min-h-11 [&_input]:w-full [&_input]:rounded [&_input]:border [&_input]:border-[#dfe4d6] [&_input]:bg-white [&_input]:px-3 [&_input]:text-sm [&_input]:text-[#263e31] [&_input]:outline-none [&_input]:transition [&_input:focus]:border-[#769264] [&_input:focus]:ring-2 [&_input:focus]:ring-[#edf2e7]">
      <label>Full name<input name="name" required defaultValue={user?.name} autoComplete="name" placeholder="Your full name" data-initial-focus /></label>
      <label>Email address<input name="email" type="email" required defaultValue={user?.email} autoComplete="email" placeholder="you@example.com" /></label>
      <label className="full-field sm:col-span-2">Street address<input name="address" required autoComplete="street-address" placeholder="Street address and apartment" /></label>
      <label>City<input name="city" required autoComplete="address-level2" placeholder="Your city" /></label>
      <label>Postal code<input name="postalCode" required autoComplete="postal-code" placeholder="Postal code" /></label>
    </div>
  );
}
