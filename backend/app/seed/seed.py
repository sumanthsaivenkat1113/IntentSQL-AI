# seed.py

import random
import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# ============================================================
# IMPORT YOUR MODELS
# ============================================================

from app.models.customer import Customer
from app.models.category import Category
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.payment import Payment
from app.models.refund import Refund
from app.models.customer_visit import CustomerVisit
from app.models.review import Review
from app.models.support_ticket import CustomerSupportTicket

# Change this import if your Base/database setup is different
from app.core.database import Base

from app.core.config import settings

# ============================================================
# DATABASE
# ============================================================

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


# ============================================================
# CONFIG
# ============================================================

SEED_COUNT = 100

random.seed(42)

NOW = datetime.now(timezone.utc)


# ============================================================
# SAMPLE DATA
# ============================================================

FIRST_NAMES = [
    "Aarav",
    "Vivaan",
    "Aditya",
    "Arjun",
    "Rahul",
    "Rohan",
    "Karthik",
    "Vikram",
    "Sanjay",
    "Akash",
    "Ananya",
    "Diya",
    "Isha",
    "Priya",
    "Sneha",
    "Kavya",
    "Meera",
    "Aditi",
    "Pooja",
    "Neha",
]

LAST_NAMES = [
    "Sharma",
    "Reddy",
    "Kumar",
    "Patel",
    "Verma",
    "Rao",
    "Gupta",
    "Singh",
    "Iyer",
    "Nair",
    "Joshi",
    "Mehta",
    "Kapoor",
    "Das",
    "Mishra",
]

CITIES = [
    "Hyderabad",
    "Bengaluru",
    "Chennai",
    "Mumbai",
    "Pune",
    "Delhi",
    "Kolkata",
    "Vijayawada",
    "Visakhapatnam",
    "Ahmedabad",
]

COUNTRIES = [
    "India",
]

PRODUCT_NAMES = [
    "Wireless Bluetooth Headphones",
    "Mechanical Gaming Keyboard",
    "Wireless Mouse",
    "USB-C Fast Charger",
    "Smart Watch",
    "Laptop Stand",
    "USB-C Hub",
    "Portable SSD 1TB",
    "Webcam Full HD",
    "Bluetooth Speaker",
    "Power Bank 20000mAh",
    "Noise Cancelling Earbuds",
    "Gaming Mouse Pad",
    "Laptop Backpack",
    "Phone Tripod",
    "LED Desk Lamp",
    "Smartphone Holder",
    "Wireless Charger",
    "HDMI Cable",
    "Ethernet Cable",
    "Portable Monitor",
    "Mechanical Keyboard",
    "Gaming Headset",
    "Tablet Stand",
    "Smart Plug",
]

CATEGORY_NAMES = [
    "Electronics",
    "Computers",
    "Mobile Accessories",
    "Audio",
    "Gaming",
    "Office",
    "Networking",
    "Storage",
    "Smart Home",
    "Wearables",
    "Accessories",
    "Cables",
    "Chargers",
    "Monitors",
    "Furniture",
    "Photography",
    "Power",
    "Peripherals",
    "Laptops",
    "Tablets",
    "Phones",
    "Security",
    "Home Office",
    "Gadgets",
    "Lifestyle",
]

CATEGORY_DESCRIPTIONS = {
    "Electronics": "Consumer electronic devices and accessories",
    "Computers": "Computer hardware and accessories",
    "Mobile Accessories": "Accessories for smartphones and mobile devices",
    "Audio": "Headphones, speakers and audio equipment",
    "Gaming": "Gaming peripherals and accessories",
    "Office": "Products for office and productivity",
    "Networking": "Networking equipment and accessories",
    "Storage": "Storage devices and memory products",
    "Smart Home": "Connected smart home devices",
    "Wearables": "Smart watches and wearable devices",
    "Accessories": "General technology accessories",
    "Cables": "Connectivity and data cables",
    "Chargers": "Charging equipment and adapters",
    "Monitors": "Computer and portable monitors",
    "Furniture": "Computer desks and ergonomic furniture",
    "Photography": "Photography and video accessories",
    "Power": "Power banks and power-related products",
    "Peripherals": "Computer input and output devices",
    "Laptops": "Laptop computers and related products",
    "Tablets": "Tablet devices and accessories",
    "Phones": "Mobile phones and related devices",
    "Security": "Security and monitoring devices",
    "Home Office": "Products designed for home offices",
    "Gadgets": "Useful consumer technology gadgets",
    "Lifestyle": "Technology products for everyday lifestyle",
}


ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
]

PAYMENT_METHODS = [
    "credit_card",
    "debit_card",
    "upi",
    "net_banking",
    "wallet",
]

PAYMENT_STATUSES = [
    "pending",
    "completed",
    "failed",
    "refunded",
]

REFUND_REASONS = [
    "Customer requested refund",
    "Product damaged during delivery",
    "Wrong product delivered",
    "Product not as described",
    "Duplicate payment",
    "Order cancelled",
]

REFUND_STATUSES = [
    "requested",
    "processing",
    "completed",
    "rejected",
]

DEVICE_TYPES = [
    "desktop",
    "mobile",
    "tablet",
]

VISIT_SOURCES = [
    "google",
    "direct",
    "instagram",
    "facebook",
    "email",
    "referral",
    "organic",
]

TICKET_CATEGORIES = [
    "Order",
    "Payment",
    "Refund",
    "Delivery",
    "Product",
    "Account",
    "Technical",
    "Cancellation",
]

TICKET_PRIORITIES = [
    "low",
    "medium",
    "high",
    "urgent",
]

TICKET_STATUSES = [
    "open",
    "in_progress",
    "resolved",
    "closed",
]

TICKET_MESSAGES = {
    "Order": [
        "Customer wants to know the status of the order.",
        "Customer is asking about a recent order.",
        "Customer received an incorrect order.",
        "Customer wants help modifying the order.",
    ],
    "Payment": [
        "Customer says the payment failed.",
        "Customer was charged but order is not confirmed.",
        "Customer is asking about a payment transaction.",
        "Customer reports a duplicate payment.",
    ],
    "Refund": [
        "Customer wants to request a refund.",
        "Customer is asking about refund status.",
        "Customer says the refund has not arrived.",
        "Customer wants to understand the refund process.",
    ],
    "Delivery": [
        "Customer wants to know where the package is.",
        "Customer says the package has not arrived.",
        "Customer is asking about delivery time.",
        "Customer reports a delayed delivery.",
    ],
    "Product": [
        "Customer wants more information about the product.",
        "Customer reports that the product is damaged.",
        "Customer says the product is not working.",
        "Customer received a product with missing accessories.",
    ],
    "Account": [
        "Customer cannot log into the account.",
        "Customer wants to change account information.",
        "Customer forgot the account password.",
        "Customer is having trouble resetting the password.",
    ],
    "Technical": [
        "Customer reports a technical issue on the website.",
        "Customer cannot complete checkout.",
        "Customer reports an error during payment.",
        "Customer says the website is not loading correctly.",
    ],
    "Cancellation": [
        "Customer wants to cancel the order.",
        "Customer is asking whether an order can be cancelled.",
        "Customer wants to cancel a recent purchase.",
    ],
}


# ============================================================
# HELPERS
# ============================================================


def random_date(days_back=365):
    return NOW - timedelta(
        days=random.randint(0, days_back),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
    )


def random_price(minimum=10, maximum=1500):
    return Decimal(str(round(random.uniform(minimum, maximum), 2)))


def random_phone(index):
    return f"+91{9000000000 + index}"


def random_status(values):
    return random.choice(values)


# ============================================================
# CREATE CATEGORIES
# ============================================================


def create_categories(session):
    categories = []

    for i in range(SEED_COUNT):
        name = CATEGORY_NAMES[i % len(CATEGORY_NAMES)]

        # Make every category unique
        if i >= len(CATEGORY_NAMES):
            name = f"{name} {i + 1}"

        category = Category(
            category_id=uuid.uuid4(),
            category_name=name,
            description=CATEGORY_DESCRIPTIONS.get(
                CATEGORY_NAMES[i % len(CATEGORY_NAMES)],
                "Product category",
            ),
            created_at=random_date(500),
        )

        categories.append(category)

    session.add_all(categories)
    session.flush()

    return categories


# ============================================================
# CREATE CUSTOMERS
# ============================================================


def create_customers(session):
    customers = []

    for i in range(SEED_COUNT):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)

        customer = Customer(
            customer_id=uuid.uuid4(),
            first_name=first_name,
            last_name=last_name,
            email=f"{first_name.lower()}.{last_name.lower()}.{i + 1}@example.com",
            phone=random_phone(i),
            signup_date=random_date(700),
            country=random.choice(COUNTRIES),
            city=random.choice(CITIES),
            status=random.choice(["active", "active", "active", "inactive"]),
            created_at=random_date(700),
        )

        customers.append(customer)

    session.add_all(customers)
    session.flush()

    return customers


# ============================================================
# CREATE PRODUCTS
# ============================================================


def create_products(session, categories):
    products = []

    for i in range(SEED_COUNT):
        base_name = PRODUCT_NAMES[i % len(PRODUCT_NAMES)]

        if i >= len(PRODUCT_NAMES):
            product_name = f"{base_name} - Model {i + 1}"
        else:
            product_name = base_name

        cost_price = random_price(10, 700)

        # Selling price is greater than cost
        price = cost_price + random_price(5, 400)

        product = Product(
            product_id=uuid.uuid4(),
            product_name=product_name,
            category_id=random.choice(categories).category_id,
            price=price,
            cost_price=cost_price,
            stock_quantity=random.randint(0, 500),
            status=random.choice(["active", "active", "active", "inactive"]),
            created_at=random_date(500),
        )

        products.append(product)

    session.add_all(products)
    session.flush()

    return products


# ============================================================
# CREATE ORDERS
# ============================================================


def create_orders(session, customers):
    orders = []

    for _ in range(SEED_COUNT):
        customer = random.choice(customers)

        subtotal = random_price(50, 3000)

        discount = Decimal(str(round(random.uniform(0, float(subtotal) * 0.15), 2)))

        taxable_amount = subtotal - discount

        tax = Decimal(str(round(float(taxable_amount) * 0.18, 2)))

        shipping = Decimal(str(round(random.choice([0, 0, 0, 49, 79, 99]), 2)))

        total = taxable_amount + tax + shipping

        order = Order(
            order_id=uuid.uuid4(),
            customer_id=customer.customer_id,
            order_date=random_date(365),
            status=random_status(ORDER_STATUSES),
            subtotal=subtotal,
            discount_amount=discount,
            tax_amount=tax,
            shipping_amount=shipping,
            total_amount=total,
            shipping_city=customer.city,
            shipping_country=customer.country,
        )

        orders.append(order)

    session.add_all(orders)
    session.flush()

    return orders


# ============================================================
# CREATE ORDER ITEMS
# ============================================================


def create_order_items(session, orders, products):
    order_items = []

    for _ in range(SEED_COUNT):
        order = random.choice(orders)
        product = random.choice(products)

        quantity = random.randint(1, 4)

        unit_price = product.price

        discount = Decimal(
            str(
                round(
                    float(unit_price * quantity) * random.uniform(0, 0.10),
                    2,
                )
            )
        )

        total = (unit_price * quantity) - discount

        item = OrderItem(
            order_item_id=uuid.uuid4(),
            order_id=order.order_id,
            product_id=product.product_id,
            quantity=quantity,
            unit_price=unit_price,
            discount_amount=discount,
            total_amount=total,
        )

        order_items.append(item)

    session.add_all(order_items)
    session.flush()

    return order_items


# ============================================================
# CREATE PAYMENTS
# ============================================================


def create_payments(session, orders, customers):
    payments = []

    for _ in range(SEED_COUNT):
        order = random.choice(orders)

        # Keep customer consistent with order
        customer_id = order.customer_id

        payment_status = random.choice(
            [
                "completed",
                "completed",
                "completed",
                "pending",
                "failed",
                "refunded",
            ]
        )

        payment = Payment(
            payment_id=uuid.uuid4(),
            order_id=order.order_id,
            customer_id=customer_id,
            payment_date=order.order_date + timedelta(minutes=random.randint(1, 120)),
            amount=order.total_amount,
            payment_method=random.choice(PAYMENT_METHODS),
            status=payment_status,
            transaction_id=f"TXN-{uuid.uuid4().hex[:20].upper()}",
        )

        payments.append(payment)

    session.add_all(payments)
    session.flush()

    return payments


# ============================================================
# CREATE REFUNDS
# ============================================================


def create_refunds(session, orders, payments, customers):
    refunds = []

    for _ in range(SEED_COUNT):
        payment = random.choice(payments)

        # Find the corresponding order
        order = next(o for o in orders if o.order_id == payment.order_id)

        refund_amount = Decimal(
            str(
                round(
                    float(payment.amount) * random.uniform(0.25, 1.0),
                    2,
                )
            )
        )

        refund = Refund(
            refund_id=uuid.uuid4(),
            order_id=order.order_id,
            payment_id=payment.payment_id,
            customer_id=payment.customer_id,
            refund_date=payment.payment_date + timedelta(days=random.randint(1, 15)),
            amount=refund_amount,
            reason=random.choice(REFUND_REASONS),
            status=random.choice(REFUND_STATUSES),
        )

        refunds.append(refund)

    session.add_all(refunds)
    session.flush()

    return refunds


# ============================================================
# CREATE CUSTOMER VISITS
# ============================================================


def create_customer_visits(session, customers):
    visits = []

    for _ in range(SEED_COUNT):
        visit = CustomerVisit(
            visit_id=uuid.uuid4(),
            customer_id=random.choice(customers).customer_id,
            visit_date=random_date(180),
            session_duration=random.randint(20, 3600),
            device_type=random.choice(DEVICE_TYPES),
            source=random.choice(VISIT_SOURCES),
            pages_viewed=random.randint(1, 30),
        )

        visits.append(visit)

    session.add_all(visits)
    session.flush()

    return visits


# ============================================================
# CREATE REVIEWS
# ============================================================


def create_reviews(session, customers, products, orders):
    reviews = []

    review_texts = [
        "Great product and fast delivery.",
        "The product works exactly as expected.",
        "Good quality for the price.",
        "Delivery was a little slow but the product is good.",
        "Very happy with the purchase.",
        "Product quality could be better.",
        "Excellent experience.",
        "The product arrived damaged.",
        "Works well and looks good.",
        "Would purchase again.",
    ]

    for _ in range(SEED_COUNT):
        customer = random.choice(customers)
        product = random.choice(products)
        order = random.choice(orders)

        review = Review(
            review_id=uuid.uuid4(),
            customer_id=customer.customer_id,
            product_id=product.product_id,
            order_id=order.order_id,
            rating=random.randint(1, 5),
            review_text=random.choice(review_texts),
            review_date=random_date(300),
            verified_purchase=random.choice([True, True, True, False]),
        )

        reviews.append(review)

    session.add_all(reviews)
    session.flush()

    return reviews


# ============================================================
# CREATE SUPPORT TICKETS
# ============================================================


def create_support_tickets(session, customers, orders):
    tickets = []

    for _ in range(SEED_COUNT):
        category = random.choice(TICKET_CATEGORIES)
        created_at = random_date(180)

        status = random.choice(
            [
                "open",
                "in_progress",
                "resolved",
                "closed",
                "resolved",
                "closed",
            ]
        )

        resolved_at = None
        resolution_time = None

        if status in ["resolved", "closed"]:
            resolution_time = random.randint(10, 1440)
            resolved_at = created_at + timedelta(minutes=resolution_time)

        # Some tickets are not related to an order
        order = random.choice(orders) if random.random() < 0.70 else None

        ticket = CustomerSupportTicket(
            ticket_id=uuid.uuid4(),
            customer_id=random.choice(customers).customer_id,
            order_id=order.order_id if order else None,
            created_at=created_at,
            resolved_at=resolved_at,
            category=category,
            priority=random.choice(TICKET_PRIORITIES),
            status=status,
            resolution_time_minutes=resolution_time,
        )

        tickets.append(ticket)

    session.add_all(tickets)
    session.flush()

    return tickets


# ============================================================
# SEED DATABASE
# ============================================================


def seed_database():
    session = SessionLocal()

    try:
        print("=" * 60)
        print("STARTING DATABASE SEED")
        print("=" * 60)

        # ----------------------------------------------------
        # Optional: clear existing data
        # ----------------------------------------------------
        #
        # Uncomment this section if you want to delete the
        # existing records before inserting the seed data.
        #
        # session.query(CustomerSupportTicket).delete()
        # session.query(Review).delete()
        # session.query(CustomerVisit).delete()
        # session.query(Refund).delete()
        # session.query(Payment).delete()
        # session.query(OrderItem).delete()
        # session.query(Order).delete()
        # session.query(Product).delete()
        # session.query(Category).delete()
        # session.query(Customer).delete()
        #
        # session.commit()

        # ----------------------------------------------------
        # 1. Categories
        # ----------------------------------------------------

        print("Creating categories...")
        categories = create_categories(session)
        print(f"✓ Categories: {len(categories)}")

        # ----------------------------------------------------
        # 2. Customers
        # ----------------------------------------------------

        print("Creating customers...")
        customers = create_customers(session)
        print(f"✓ Customers: {len(customers)}")

        # ----------------------------------------------------
        # 3. Products
        # ----------------------------------------------------

        print("Creating products...")
        products = create_products(session, categories)
        print(f"✓ Products: {len(products)}")

        # ----------------------------------------------------
        # 4. Orders
        # ----------------------------------------------------

        print("Creating orders...")
        orders = create_orders(session, customers)
        print(f"✓ Orders: {len(orders)}")

        # ----------------------------------------------------
        # 5. Order Items
        # ----------------------------------------------------

        print("Creating order items...")
        order_items = create_order_items(
            session,
            orders,
            products,
        )
        print(f"✓ Order Items: {len(order_items)}")

        # ----------------------------------------------------
        # 6. Payments
        # ----------------------------------------------------

        print("Creating payments...")
        payments = create_payments(
            session,
            orders,
            customers,
        )
        print(f"✓ Payments: {len(payments)}")

        # ----------------------------------------------------
        # 7. Refunds
        # ----------------------------------------------------

        print("Creating refunds...")
        refunds = create_refunds(
            session,
            orders,
            payments,
            customers,
        )
        print(f"✓ Refunds: {len(refunds)}")

        # ----------------------------------------------------
        # 8. Customer Visits
        # ----------------------------------------------------

        print("Creating customer visits...")
        visits = create_customer_visits(
            session,
            customers,
        )
        print(f"✓ Customer Visits: {len(visits)}")

        # ----------------------------------------------------
        # 9. Reviews
        # ----------------------------------------------------

        print("Creating reviews...")
        reviews = create_reviews(
            session,
            customers,
            products,
            orders,
        )
        print(f"✓ Reviews: {len(reviews)}")

        # ----------------------------------------------------
        # 10. Support Tickets
        # ----------------------------------------------------

        print("Creating support tickets...")
        tickets = create_support_tickets(
            session,
            customers,
            orders,
        )
        print(f"✓ Support Tickets: {len(tickets)}")

        # ----------------------------------------------------
        # COMMIT
        # ----------------------------------------------------

        session.commit()

        print()
        print("=" * 60)
        print("DATABASE SEED COMPLETED")
        print("=" * 60)
        print()
        print("Records inserted:")
        print(f"  Categories             : {len(categories)}")
        print(f"  Customers              : {len(customers)}")
        print(f"  Products               : {len(products)}")
        print(f"  Orders                 : {len(orders)}")
        print(f"  Order Items            : {len(order_items)}")
        print(f"  Payments               : {len(payments)}")
        print(f"  Refunds                : {len(refunds)}")
        print(f"  Customer Visits        : {len(visits)}")
        print(f"  Reviews                : {len(reviews)}")
        print(f"  Support Tickets        : {len(tickets)}")
        print()
        print(f"TOTAL RECORDS: {sum([
            len(categories),
            len(customers),
            len(products),
            len(orders),
            len(order_items),
            len(payments),
            len(refunds),
            len(visits),
            len(reviews),
            len(tickets),
        ])}")
        print("=" * 60)

    except Exception as e:
        session.rollback()

        print()
        print("=" * 60)
        print("SEED FAILED")
        print("=" * 60)
        print(f"Error: {e}")

        raise

    finally:
        session.close()


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    seed_database()
