const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl !== undefined) {
    // Strip any literal quotes that might have been added in deployment dashboards
    return envUrl.replace(/['"]/g, "");
  }
  return import.meta.env.DEV ? "http://localhost:4000" : "";
};

const API_BASE = getApiBase();

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
