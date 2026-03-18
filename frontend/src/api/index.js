const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

async function handleResponse(res) {
  if (!res.ok) {
    throw new Error("API Error");
  }
  return res.json();
}

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    return await handleResponse(res);
  } catch (err) {
    return [];
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: err.message };
  }
}

export async function createOrder(data) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: err.message };
  }
}

export async function fetchCustomers() {
  const res = await fetch(`${API_BASE}/customers`);
  return res.json();
}

export async function searchCustomers(name) {
  const res = await fetch(`${API_BASE}/customers/search?name=${name}`);
  return res.json();
}

export async function createCustomer(data) {
  const res = await fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
}