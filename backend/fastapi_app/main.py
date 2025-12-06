from fastapi import FastAPI, Depends, HTTPException, status, Cookie
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, UUID4
from typing import Optional, List
import os
import sys
from datetime import datetime, timedelta
import secrets
from decimal import Decimal

# Add Django project to path
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')

# Setup Django
import django
django.setup()

# Import Django models
from api.models import User, Restaurant, Menu, Order, OrderItem, PaymentMethod, CartItem

app = FastAPI(title="Slooze API", version="0.1.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store (use Redis in production)
SESSIONS = {}

# Models
class Health(BaseModel):
    status: str
    database: str

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    user: dict
    token: str

class RestaurantResponse(BaseModel):
    id: str
    name: str
    country: str
    description: str

class MenuResponse(BaseModel):
    id: str
    restaurantId: str
    name: str
    price: float
    description: str

class CreateOrderRequest(BaseModel):
    restaurantId: str
    items: List[dict]
    totalAmount: float

class OrderResponse(BaseModel):
    id: str
    userId: str
    restaurantId: str
    totalAmount: float
    status: str
    createdAt: str

class PaymentMethodResponse(BaseModel):
    id: str
    userId: str
    cardLast4: str
    type: str

class CreatePaymentMethodRequest(BaseModel):
    userId: str
    cardLast4: str
    type: str

class AddToCartRequest(BaseModel):
    menuId: str
    quantity: int
    price: float
    restaurantId: str

class CartItemResponse(BaseModel):
    id: str
    menuId: str
    name: str
    quantity: int
    price: float
    restaurantId: str

# Auth helpers
def get_current_user(auth_token: Optional[str] = Cookie(None)):
    if not auth_token or auth_token not in SESSIONS:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    session = SESSIONS[auth_token]
    if session["expires_at"] < datetime.now():
        del SESSIONS[auth_token]
        raise HTTPException(status_code=401, detail="Session expired")
    
    return session["user"]

def check_role(user: dict, allowed_roles: List[str]):
    if user["role"] not in allowed_roles:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

# Endpoints
@app.get("/health", response_model=Health)
def health():
    db = os.environ.get("POSTGRES_DB", "foodorder_db")
    return {"status": "ok", "database": db}

@app.post("/api/auth/login", response_model=LoginResponse)
def login(credentials: LoginRequest):
    try:
        user = User.objects.get(email=credentials.email, password=credentials.password)
    except User.DoesNotExist:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_data = {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "country": user.country
    }
    
    token = secrets.token_hex(32)
    SESSIONS[token] = {
        "user": user_data,
        "expires_at": datetime.now() + timedelta(hours=24)
    }
    
    return {"user": user_data, "token": token}

@app.post("/api/auth/logout")
def logout(auth_token: Optional[str] = Cookie(None)):
    if auth_token and auth_token in SESSIONS:
        del SESSIONS[auth_token]
    return {"success": True}

@app.get("/api/restaurants", response_model=List[RestaurantResponse])
def get_restaurants(country: Optional[str] = None, user: dict = Depends(get_current_user)):
    if user["role"] == "admin":
        # Admin can filter by country or view all
        if country:
            restaurants = Restaurant.objects.filter(country=country)
        else:
            restaurants = Restaurant.objects.all()
    else:
        # Managers and members can only see their country
        restaurants = Restaurant.objects.filter(country=user["country"])
    
    return [
        {
            "id": str(r.id),
            "name": r.name,
            "country": r.country,
            "description": r.description
        }
        for r in restaurants
    ]

@app.get("/api/menus", response_model=List[MenuResponse])
def get_menus(restaurantId: Optional[str] = None, user: dict = Depends(get_current_user)):
    if user["role"] == "admin":
        if restaurantId:
            menus = Menu.objects.filter(restaurant_id=restaurantId).select_related('restaurant')
        else:
            menus = Menu.objects.all().select_related('restaurant')
    else:
        if restaurantId:
            menus = Menu.objects.filter(
                restaurant_id=restaurantId,
                restaurant__country=user["country"]
            ).select_related('restaurant')
        else:
            menus = Menu.objects.filter(
                restaurant__country=user["country"]
            ).select_related('restaurant')
    
    return [
        {
            "id": str(m.id),
            "restaurantId": str(m.restaurant.id),
            "name": m.name,
            "price": float(m.price),
            "description": m.description
        }
        for m in menus
    ]

@app.get("/api/orders")
def get_orders(user: dict = Depends(get_current_user)):
    if user["role"] == "member":
        raise HTTPException(status_code=403, detail="Members cannot view orders")
    
    if user["role"] == "admin":
        orders = Order.objects.all().select_related('user', 'restaurant').prefetch_related('items__menu').order_by('-created_at')
    else:
        orders = Order.objects.filter(
            restaurant__country=user["country"]
        ).select_related('user', 'restaurant').prefetch_related('items__menu').order_by('-created_at')
    
    orders_list = []
    for order in orders:
        order_dict = {
            "id": str(order.id),
            "userId": str(order.user.id),
            "restaurantId": str(order.restaurant.id),
            "totalAmount": float(order.total_amount),
            "status": order.status,
            "createdAt": order.created_at.isoformat(),
            "items": [
                {
                    "itemId": str(item.menu.id),
                    "name": item.menu.name,
                    "qty": item.quantity,
                    "price": float(item.price)
                }
                for item in order.items.all()
            ]
        }
        orders_list.append(order_dict)
    
    return orders_list

@app.post("/api/orders", response_model=OrderResponse)
def create_order(order_data: CreateOrderRequest, user: dict = Depends(get_current_user)):
    if user["role"] == "member":
        raise HTTPException(status_code=403, detail="Members cannot place orders")
    
    user_obj = User.objects.get(id=user["id"])
    
    try:
        restaurant_obj = Restaurant.objects.get(id=order_data.restaurantId)
    except Restaurant.DoesNotExist:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Managers can only create orders for restaurants in their country
    if user["role"] == "manager" and restaurant_obj.country != user["country"]:
        raise HTTPException(status_code=403, detail="Cannot create orders for restaurants outside your country")
    
    # Create order
    order = Order.objects.create(
        user=user_obj,
        restaurant=restaurant_obj,
        total_amount=order_data.totalAmount,
        status='confirmed'
    )
    
    # Create order items
    for item in order_data.items:
        menu_obj = Menu.objects.get(id=item["menuId"])
        OrderItem.objects.create(
            order=order,
            menu=menu_obj,
            quantity=item["quantity"],
            price=item["price"]
        )
    
    return {
        "id": str(order.id),
        "userId": str(order.user.id),
        "restaurantId": str(order.restaurant.id),
        "totalAmount": float(order.total_amount),
        "status": order.status,
        "createdAt": order.created_at.isoformat()
    }

@app.post("/api/orders/{order_id}/cancel")
def cancel_order(order_id: str, user: dict = Depends(get_current_user)):
    if user["role"] == "member":
        raise HTTPException(status_code=403, detail="Members cannot cancel orders")
    
    try:
        order = Order.objects.select_related('restaurant').get(id=order_id)
    except Order.DoesNotExist:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Managers can only cancel orders for restaurants in their country
    if user["role"] == "manager" and order.restaurant.country != user["country"]:
        raise HTTPException(status_code=403, detail="Cannot cancel orders for restaurants outside your country")
    
    order.status = 'cancelled'
    order.save()
    
    return {
        "id": str(order.id),
        "userId": str(order.user.id),
        "restaurantId": str(order.restaurant.id),
        "totalAmount": float(order.total_amount),
        "status": order.status,
        "createdAt": order.created_at.isoformat()
    }

@app.get("/api/payment-methods", response_model=List[PaymentMethodResponse])
def get_payment_methods(user: dict = Depends(get_current_user)):
    if user["role"] == "admin":
        methods = PaymentMethod.objects.all()
    else:
        methods = PaymentMethod.objects.filter(user_id=user["id"])
    
    return [
        {
            "id": str(m.id),
            "userId": str(m.user.id),
            "cardLast4": m.card_last4,
            "type": m.type
        }
        for m in methods
    ]

@app.post("/api/payment-methods", response_model=PaymentMethodResponse)
def create_payment_method(pm_data: CreatePaymentMethodRequest, user: dict = Depends(get_current_user)):
    if user["role"] == "member":
        raise HTTPException(status_code=403, detail="Members cannot update payment methods")
    
    if user["role"] != "admin" and pm_data.userId != user["id"]:
        raise HTTPException(status_code=403, detail="Cannot update other users' payment methods")
    
    user_obj = User.objects.get(id=pm_data.userId)
    pm = PaymentMethod.objects.create(
        user=user_obj,
        card_last4=pm_data.cardLast4,
        type=pm_data.type
    )
    
    return {
        "id": str(pm.id),
        "userId": str(pm.user.id),
        "cardLast4": pm.card_last4,
        "type": pm.type
    }

# Cart endpoints using Django ORM
@app.get("/api/cart", response_model=List[CartItemResponse])
def get_cart(user: dict = Depends(get_current_user)):
    user_obj = User.objects.get(id=user["id"])
    
    if user["role"] == "admin":
        cart_items = CartItem.objects.filter(user=user_obj).select_related('menu', 'restaurant').order_by('-created_at')
    else:
        # Managers and members can only see cart items from their country
        cart_items = CartItem.objects.filter(
            user=user_obj,
            restaurant__country=user["country"]
        ).select_related('menu', 'restaurant').order_by('-created_at')
    
    return [
        {
            "id": str(item.id),
            "menuId": str(item.menu.id),
            "name": item.menu.name,
            "quantity": item.quantity,
            "price": float(item.price),
            "restaurantId": str(item.restaurant.id)
        }
        for item in cart_items
    ]

@app.post("/api/cart")
def add_to_cart(cart_item: AddToCartRequest, user: dict = Depends(get_current_user)):
    user_obj = User.objects.get(id=user["id"])
    
    try:
        menu_obj = Menu.objects.select_related('restaurant').get(id=cart_item.menuId)
        restaurant_obj = Restaurant.objects.get(id=cart_item.restaurantId)
    except (Menu.DoesNotExist, Restaurant.DoesNotExist):
        raise HTTPException(status_code=404, detail="Menu or restaurant not found")
    
    # Managers and members can only add items from their country's restaurants
    if user["role"] in ["manager", "member"] and restaurant_obj.country != user["country"]:
        raise HTTPException(status_code=403, detail="Cannot add items from restaurants outside your country")
    
    # Verify menu belongs to the restaurant and matches user's country
    if menu_obj.restaurant.id != restaurant_obj.id:
        raise HTTPException(status_code=400, detail="Menu does not belong to this restaurant")
    
    if user["role"] in ["manager", "member"] and menu_obj.restaurant.country != user["country"]:
        raise HTTPException(status_code=403, detail="Cannot add items from restaurants outside your country")
    
    # Check if item already exists in cart
    existing = CartItem.objects.filter(user=user_obj, menu=menu_obj).first()
    
    if existing:
        # Update quantity
        existing.quantity += cart_item.quantity
        existing.price = cart_item.price
        existing.save()
        item = existing
    else:
        # Create new cart item
        item = CartItem.objects.create(
            user=user_obj,
            menu=menu_obj,
            restaurant=restaurant_obj,
            quantity=cart_item.quantity,
            price=cart_item.price
        )
    
    return {
        "id": str(item.id),
        "menuId": str(item.menu.id),
        "name": item.menu.name,
        "quantity": item.quantity,
        "price": float(item.price),
        "restaurantId": str(item.restaurant.id)
    }

@app.delete("/api/cart")
def remove_from_cart(itemId: str, user: dict = Depends(get_current_user)):
    user_obj = User.objects.get(id=user["id"])
    
    try:
        item = CartItem.objects.get(id=itemId, user=user_obj)
        item.delete()
        return {"success": True}
    except CartItem.DoesNotExist:
        raise HTTPException(status_code=404, detail="Cart item not found")

@app.post("/api/cart/clear")
def clear_cart(user: dict = Depends(get_current_user)):
    user_obj = User.objects.get(id=user["id"])
    CartItem.objects.filter(user=user_obj).delete()
    return {"success": True}
