const buildQueryString = (params = {}) => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return query ? `?${query}` : '';
};

const buildHeaders = (token, extraHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseJson = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
};

const handleResponse = async (response) => {
  const data = await parseJson(response);

  if (!response.ok) {
    const error = new Error(data?.error || data?.message || response.statusText || 'Erro na requisição');
    error.status = response.status;
    error.body = data;
    throw error;
  }

  return data;
};

const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  return handleResponse(response);
};

const get = async (url, params = {}, token) => {
  const queryString = buildQueryString(params);
  return apiFetch(`${url}${queryString}`, {
    method: 'GET',
    headers: buildHeaders(token),
  });
};

const post = async (url, body = {}, token, extraHeaders = {}) => {
  return apiFetch(url, {
    method: 'POST',
    headers: buildHeaders(token, extraHeaders),
    body: JSON.stringify(body),
  });
};

const put = async (url, body = {}, token, extraHeaders = {}) => {
  return apiFetch(url, {
    method: 'PUT',
    headers: buildHeaders(token, extraHeaders),
    body: JSON.stringify(body),
  });
};

const patch = async (url, body = {}, token, extraHeaders = {}) => {
  return apiFetch(url, {
    method: 'PATCH',
    headers: buildHeaders(token, extraHeaders),
    body: JSON.stringify(body),
  });
};

const del = async (url, token) => {
  return apiFetch(url, {
    method: 'DELETE',
    headers: buildHeaders(token),
  });
};

const postForm = async (url, formData, token, extraHeaders = {}) => {
  const headers = { ...extraHeaders };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return apiFetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
};

const ApiClient = {
  buildQueryString,
  buildHeaders,
  get,
  post,
  put,
  patch,
  delete: del,
  postForm,
  withAuth: (token) => ({
    get: (url, params) => get(url, params, token),
    post: (url, body, extraHeaders) => post(url, body, token, extraHeaders),
    put: (url, body, extraHeaders) => put(url, body, token, extraHeaders),
    patch: (url, body, extraHeaders) => patch(url, body, token, extraHeaders),
    delete: (url) => del(url, token),
    postForm: (url, formData, extraHeaders) => postForm(url, formData, token, extraHeaders),
  }),
};

window.ApiClient = ApiClient;
