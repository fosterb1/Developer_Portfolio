const API_BASE = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:4000" : "");

const buildHeaders = (token, extra = {}, isFormData = false) => ({
  ...(isFormData ? {} : { "Content-Type": "application/json" }),
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...extra,
});

async function request(
  path,
  { method = "GET", data, token, headers = {}, isFormData = false } = {}
) {
  const opts = {
    method,
    headers: buildHeaders(token, headers, isFormData),
    credentials: "include",
  };
  if (data) {
    opts.body = isFormData ? data : JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}${path}`, opts);
  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const errorMessage =
      typeof payload === "string"
        ? payload
        : payload?.error || "Request failed";
    throw new Error(errorMessage);
  }

  return payload;
}

export { API_BASE, request };
