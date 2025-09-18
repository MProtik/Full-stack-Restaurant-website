const API_URL = "http://127.0.0.1:8000"; // FastAPI server

// Load all orders
async function loadOrders() {
  let res = await fetch(`${API_URL}/orders`);
  let orders = await res.json();

  // Pending Orders
  let pendingTable = document.querySelector("#pendingOrders tbody");
  pendingTable.innerHTML = "";
  orders.filter(o => o.status === "Pending").forEach(order => {
    pendingTable.innerHTML += `
      <tr>
        <td>${order.id}</td>
        <td>${order.customer_name}</td>
        <td>${order.items}</td>
        <td>${order.status}</td>
        <td>
          <button class="accept" onclick="acceptOrder(${order.id})">Accept</button>
        </td>
      </tr>`;
  });

  // All Orders
  let allTable = document.querySelector("#allOrders tbody");
  allTable.innerHTML = "";
  orders.forEach(order => {
    allTable.innerHTML += `
      <tr>
        <td>${order.id}</td>
        <td>${order.customer_name}</td>
        <td>${order.items}</td>
        <td>${order.status}</td>
        <td>${order.created_at}</td>
      </tr>`;
  });
}

// Accept order → change status to Preparing
async function acceptOrder(orderId) {
  await fetch(`${API_URL}/update-order/${orderId}?status=Preparing`, {
    method: "PUT"
  });
  loadOrders();
}

// Refresh every 10s
setInterval(loadOrders, 10000);
loadOrders();
