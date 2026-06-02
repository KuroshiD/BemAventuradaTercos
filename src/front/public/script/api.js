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
  let response = await fetch(url, options);

  // If unauthorized and we have a refresh token, attempt refresh and retry once
  if (response.status === 401 && typeof window !== 'undefined') {
    try {
      const storedRefresh = localStorage.getItem('ba_refresh_token');
      if (storedRefresh) {
        const refreshRes = await fetch('/adm/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: storedRefresh }),
        });

        if (refreshRes.ok) {
          const tokens = await parseJson(refreshRes);
          if (tokens?.accessToken) {
            localStorage.setItem('ba_admin_token', tokens.accessToken);
            if (tokens.refreshToken) localStorage.setItem('ba_refresh_token', tokens.refreshToken);
            // retry original request with new token
            const newHeaders = { ...(options.headers || {}) };
            newHeaders.Authorization = `Bearer ${tokens.accessToken}`;
            response = await fetch(url, { ...options, headers: newHeaders });
          }
        }
      }
    } catch (e) {
      // ignore refresh failures and fall through to error handling
      console.warn('Token refresh failed', e);
    }
  }

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

const putForm = async (url, formData, token, extraHeaders = {}) => {
  const headers = { ...extraHeaders };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return apiFetch(url, {
    method: 'PUT',
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
  putForm,
  withAuth: (token) => ({
    get: (url, params) => get(url, params, token),
    post: (url, body, extraHeaders) => post(url, body, token, extraHeaders),
    put: (url, body, extraHeaders) => put(url, body, token, extraHeaders),
    patch: (url, body, extraHeaders) => patch(url, body, token, extraHeaders),
    delete: (url) => del(url, token),
    postForm: (url, formData, extraHeaders) => postForm(url, formData, token, extraHeaders),
    putForm: (url, formData, extraHeaders) => putForm(url, formData, token, extraHeaders),
  }),
};

window.ApiClient = ApiClient;
