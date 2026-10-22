import { useEffect, useId, useRef, useState } from "react";
import { FiArrowRight, FiImage, FiUploadCloud, FiX } from "react-icons/fi";
import DashboardDialog from "./DashboardDialog.jsx";

export default function ProductForm({
  product,
  categories = [],
  onSave,
  onClose,
  standalone = false,
}) {
  const titleId = useId();
  const categoryId = useId();
  const imageHelpId = useId();
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [category, setCategory] = useState(product?.category || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const mounted = useRef(false);
  const request = useRef(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!imageFile || !imageFile.type.startsWith("image/")) {
      setImagePreview("");
      return;
    }
    const preview = URL.createObjectURL(imageFile);
    setImagePreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [imageFile]);

  async function submit(event) {
    event.preventDefault();
    if (request.current || saving || product) return;
    setError("");

    const amount = Number(price);
    if (!name.trim() || !category.trim()) {
      setError("Please enter a product name and category.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a price greater than zero.");
      return;
    }
    if (!imageFile || imageFile.size === 0) {
      setError("Choose a product image file to upload.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
      setError("Choose a JPG, JPEG, PNG, or WebP image.");
      return;
    }
    if (imageFile.size > 2 * 1024 * 1024) {
      setError("Choose an image that is 2 MB or smaller.");
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    setSaving(true);
    try {
      const body = new FormData();
      body.append("productName", name.trim());
      body.append("productPrice", String(amount));
      body.append("productCategory", category.trim());
      body.append("productImage", imageFile);

      // The product upload request is intentionally kept in this form.
      const apiUrl =
        import.meta.env.VITE_ADD_PRODUCT_API_URL?.trim() ||
        "https://fullstack-ecommerce2.onrender.com/addProduct";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
        signal: controller.signal,
      });
      const text = await response.text();
      let payload;
      try {
        payload = JSON.parse(text);
      } catch {
        throw new Error(
          response.ok
            ? "The server did not return the saved product. Please check the upload response."
            : `The upload failed (${response.status}). Please try again.`,
        );
      }
      if (!response.ok)
        throw new Error(
          typeof payload?.message === "string"
            ? payload.message
            : `The upload failed (${response.status}). Please try again.`,
        );

      const saved = payload?.product ?? payload?.data?.product;
      const savedId = saved?._id ?? saved?.id;
      const savedName = saved?.productName ?? saved?.name ?? saved?.title;
      const savedPrice = Number(saved?.productPrice ?? saved?.price);
      if (
        !["string", "number"].includes(typeof savedId) ||
        !String(savedId).trim() ||
        typeof savedName !== "string" ||
        !savedName.trim() ||
        !Number.isFinite(savedPrice) ||
        savedPrice < 0
      ) {
        throw new Error("The server returned an incomplete saved product.");
      }
      const savedCategory = saved.productCategory ?? saved.category;
      const savedImage = saved.productImage ?? saved.image;
      let image = "";
      if (typeof savedImage === "string" && savedImage.trim()) {
        try {
          const url = new URL(
            savedImage,
            new URL(apiUrl, window.location.origin),
          );
          if (["http:", "https:"].includes(url.protocol)) image = url.href;
        } catch {
          // A missing image uses the product card's neutral placeholder.
        }
      }
      const stock = saved.stock == null ? null : Number(saved.stock);
      const savedProduct = {
        ...saved,
        id: String(savedId),
        name: savedName.trim(),
        price: savedPrice,
        category:
          typeof savedCategory === "string" ? savedCategory : "",
        image,
        description:
          typeof saved.description === "string" ? saved.description : "",
        seller: typeof saved.seller === "string" ? saved.seller : "",
        stock: Number.isSafeInteger(stock) && stock >= 0 ? stock : null,
        colors: Array.isArray(saved.colors)
          ? saved.colors.filter((color) => typeof color === "string")
          : [],
        badge: typeof saved.badge === "string" ? saved.badge : "",
        rating: Number.isFinite(saved.rating) ? saved.rating : undefined,
        reviews: Number.isFinite(saved.reviews) ? saved.reviews : undefined,
      };
      if (!mounted.current) return;
      await onSave(savedProduct);
      if (mounted.current) onClose?.();
    } catch (issue) {
      if (mounted.current && issue.name !== "AbortError")
        setError(
          issue instanceof TypeError
            ? "We couldn’t reach the upload service. Check your connection and try again."
            : issue.message || "We couldn’t save this product. Please try again.",
        );
    } finally {
      request.current = null;
      if (mounted.current) setSaving(false);
    }
  }

  const form = (
    <>
      <div className="mb-7 flex items-start justify-between gap-5">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7b876f]">
            A little more to discover
          </p>
          <h2 id={titleId} className="font-serif text-3xl leading-tight tracking-tight text-[#263e31]">
            {product ? "Your product" : "Add a new product"}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#7a8374]">
            Give your product a name, choose its price, and share a photograph.
          </p>
        </div>
        {!standalone && (
          <button
            type="button"
            aria-label="Close product form"
            disabled={saving}
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#718069] transition hover:bg-[#eef1e8] disabled:cursor-wait disabled:opacity-50"
          >
            <FiX aria-hidden="true" />
          </button>
        )}
      </div>
      {product && (
        <p role="status" className="mb-6 rounded-lg border border-[#e8dfc4] bg-[#fbf7e9] p-4 text-sm leading-6 text-[#79633b]">
          Product editing is not connected yet. Your existing product has not been changed.
        </p>
      )}
      <form onSubmit={submit} className="dash-form space-y-5" aria-busy={saving}>
        <label className="block text-xs font-semibold text-[#52634b]">
          Product name
          <input
            name="name"
            required
            maxLength={120}
            data-initial-focus
            disabled={saving || Boolean(product)}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Wooden study desk"
            className="mt-2 block w-full rounded-lg border border-[#dfe4d8] bg-white px-4 py-3 text-sm font-normal text-[#263e31] outline-none transition placeholder:text-[#a0a695] focus:border-[#547858] focus:ring-2 focus:ring-[#e3ebdc] disabled:bg-[#f4f5ef]"
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-[#52634b]">
            Price (₦ NGN)
            <input
              name="price"
              type="number"
              required
              min="0.01"
              step="0.01"
              disabled={saving || Boolean(product)}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="0.00"
              className="mt-2 block w-full rounded-lg border border-[#dfe4d8] bg-white px-4 py-3 text-sm font-normal text-[#263e31] outline-none transition placeholder:text-[#a0a695] focus:border-[#547858] focus:ring-2 focus:ring-[#e3ebdc] disabled:bg-[#f4f5ef]"
            />
          </label>
          <label className="block text-xs font-semibold text-[#52634b]">
            Category
            <input
              name="category"
              required
              list={categoryId}
              disabled={saving || Boolean(product)}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="e.g. Tables"
              className="mt-2 block w-full rounded-lg border border-[#dfe4d8] bg-white px-4 py-3 text-sm font-normal text-[#263e31] outline-none transition placeholder:text-[#a0a695] focus:border-[#547858] focus:ring-2 focus:ring-[#e3ebdc] disabled:bg-[#f4f5ef]"
            />
            <datalist id={categoryId}>
              {[...new Set(categories)].map((value) => <option key={value} value={value} />)}
            </datalist>
          </label>
        </div>
        {!product && (
          <div className="rounded-xl border border-dashed border-[#b9c6ac] bg-[#f4f6ef] p-5">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e5ebdc] text-[#547858]">
                <FiUploadCloud size={21} aria-hidden="true" />
              </span>
              <div>
                <label htmlFor={`${titleId}-image`} className="block text-xs font-semibold text-[#52634b]">
                  Product image
                </label>
                <p id={imageHelpId} className="mt-1 text-xs leading-5 text-[#7a8374]">
                  JPG, JPEG, PNG, or WebP. Maximum 2 MB.
                </p>
              </div>
            </div>
            <input
              id={`${titleId}-image`}
              name="productImage"
              type="file"
              required
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              aria-describedby={imageHelpId}
              disabled={saving}
              onChange={(event) => { setImageFile(event.target.files?.[0] || null); setError(""); }}
              className="block w-full text-xs text-[#6d7b62] file:mr-3 file:rounded-md file:border-0 file:bg-[#234d39] file:px-3 file:py-2 file:font-medium file:text-white hover:file:bg-[#305c46] disabled:opacity-50"
            />
            {imageFile && (
              <div className="mt-4 flex min-w-0 items-center gap-3 rounded-lg bg-white p-3">
                {imagePreview ? (
                  <img src={imagePreview} alt="Selected product preview" className="size-16 shrink-0 rounded-md bg-[#eef1e7] object-contain" />
                ) : (
                  <FiImage className="size-7 shrink-0 text-[#819173]" aria-hidden="true" />
                )}
                <p className="min-w-0 break-all text-xs leading-5 text-[#6f7d65]">Selected: {imageFile.name}</p>
              </div>
            )}
          </div>
        )}
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">{error}</p>}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#e7eade] pt-5">
          <button type="button" disabled={saving} onClick={onClose} className="rounded-lg border border-[#dbe1d3] px-5 py-3 text-xs font-medium text-[#52634b] transition hover:bg-[#f0f3e9] disabled:cursor-wait disabled:opacity-50">
            {product ? "Back" : "Cancel"}
          </button>
          <button type="submit" disabled={saving || Boolean(product)} className="inline-flex items-center gap-4 rounded-lg bg-[#234d39] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#315c45] disabled:cursor-not-allowed disabled:opacity-50">
            {saving ? "Uploading…" : product ? "Editing unavailable" : "Add product"}
            <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </form>
    </>
  );

  return standalone ? (
    <section aria-labelledby={titleId} className="rounded-2xl border border-[#e1e6d9] bg-[#fffefa] p-5 sm:p-8">
      {form}
    </section>
  ) : (
    <DashboardDialog onClose={onClose} busy={saving} titleId={titleId}>{form}</DashboardDialog>
  );
}
