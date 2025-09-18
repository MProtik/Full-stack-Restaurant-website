from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import mysql.connector

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="userdb"
)
cursor = conn.cursor(dictionary=True)

# Submit order
@app.post("/submit-order/")
def submit_order(
    name: str = Form(...),
    phone: str = Form(...),
    food_name: str = Form(...),
    additional_food: str = Form(...),
    quantity: str = Form(...),
    datetime: str = Form(...),
    address: str = Form(...),
    message: str = Form(...)
):
    query = """
    INSERT INTO orders (name, phone, food_name, additional_food, quantity, datetime, address, message, status)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (name, phone, food_name, additional_food, quantity, datetime, address, message, "pending")
    try:
        cursor.execute(query, values)
        conn.commit()
        return JSONResponse(content={
            "message": "Thank you! Your order has been received.",
            "order_id": cursor.lastrowid
        })
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Get pending orders
@app.get("/orders/pending/")
def get_pending_orders():
    cursor.execute("SELECT * FROM orders WHERE status IN ('pending', 'accepted')")
    orders = cursor.fetchall()
    return {"orders": orders}

# Update order status
@app.post("/update-order/")
def update_order(
    order_id: int = Form(...),
    status: str = Form(...)
):
    status = status.lower()
    if status not in ["accepted", "rejected", "delivered", "not delivered"]:
        return {"error": "Invalid status"}
    
    cursor.execute("UPDATE orders SET status=%s WHERE id=%s", (status, order_id))
    conn.commit()
    return {"message": f"Order {order_id} updated to {status}"}

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="userdb"
    )

@app.get("/order-status/{order_id}")
def get_order_status(order_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, status FROM orders WHERE id = %s", (order_id,))
        order = cursor.fetchone()
        cursor.close()
        conn.close()

        if order:
            return {"id": order["id"], "status": order["status"]}
        else:
            return JSONResponse(content={"error": "Order not found"}, status_code=404)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/last_id")
def get_last_id():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch the last inserted order
        cursor.execute("SELECT * FROM orders ORDER BY id DESC LIMIT 1")
        order = cursor.fetchone()

        cursor.close()
        conn.close()

        if order:
            return {"id": order["id"], "status": order["status"]}
        else:
            return JSONResponse(content={"error": "No orders found"}, status_code=404)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
