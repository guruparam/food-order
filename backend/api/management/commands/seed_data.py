from django.core.management.base import BaseCommand
from api.models import User, Restaurant, Menu, PaymentMethod


class Command(BaseCommand):
    help = "Seeds the database with initial data"

    def handle(self, *args, **kwargs):
        # Clear existing data
        User.objects.all().delete()
        Restaurant.objects.all().delete()
        Menu.objects.all().delete()
        PaymentMethod.objects.all().delete()

        self.stdout.write("Creating users...")
        # Note: Using plain passwords for FastAPI compatibility (dev only!)
        admin = User.objects.create(
            email="nickfury@admin.com",
            password="admin123",
            name="Nick Fury",
            role="admin",
            country="USA",
            is_staff=True,
        )

        manager_india = User.objects.create(
            email="captainmarvel@manager.com",
            password="manager123",
            name="Captain Marvel",
            role="manager",
            country="India",
        )

        manager_usa = User.objects.create(
            email="captainamerica@manager.com",
            password="manager123",
            name="Captain America",
            role="manager",
            country="USA",
        )

        member_india_1 = User.objects.create(
            email="thanos@member.com",
            password="member123",
            name="Thanos",
            role="member",
            country="India",
        )

        member_india_2 = User.objects.create(
            email="thor@member.com",
            password="member123",
            name="Thor",
            role="member",
            country="India",
        )

        member_usa = User.objects.create(
            email="travis@member.com",
            password="member123",
            name="Travis",
            role="member",
            country="USA",
        )

        self.stdout.write("Creating restaurants...")
        # India Restaurants
        rest_india_1 = Restaurant.objects.create(
            name="Mumbai Masala",
            country="India",
            description="Authentic Indian Cuisine with rich flavors and aromatic spices",
        )

        rest_india_2 = Restaurant.objects.create(
            name="Delhi Delights",
            country="India",
            description="North Indian Specialties featuring tandoori and curry dishes",
        )

        rest_india_3 = Restaurant.objects.create(
            name="Bangalore Bistro",
            country="India",
            description="South Indian cuisine with dosas, idlis, and flavorful curries",
        )

        rest_india_4 = Restaurant.objects.create(
            name="Kolkata Kitchen",
            country="India",
            description="Bengali specialties and traditional sweets",
        )

        # USA Restaurants
        rest_usa_1 = Restaurant.objects.create(
            name="New York Pizza",
            country="USA",
            description="Classic New York-style pizzas with hand-tossed dough",
        )

        rest_usa_2 = Restaurant.objects.create(
            name="Texas Burger House",
            country="USA",
            description="Premium burgers with fresh ingredients and bold flavors",
        )

        rest_usa_3 = Restaurant.objects.create(
            name="California Grill",
            country="USA",
            description="Fresh seafood and healthy California-style cuisine",
        )

        rest_usa_4 = Restaurant.objects.create(
            name="Chicago Steakhouse",
            country="USA",
            description="Prime cuts and classic American steakhouse favorites",
        )

        # UK Restaurants
        rest_uk_1 = Restaurant.objects.create(
            name="London Fish & Chips",
            country="UK",
            description="Traditional British fish and chips with mushy peas",
        )

        rest_uk_2 = Restaurant.objects.create(
            name="Edinburgh Pub",
            country="UK",
            description="Classic pub fare with shepherd's pie and bangers",
        )

        self.stdout.write("Creating menus...")
        # Mumbai Masala (India) - 5 items
        Menu.objects.create(
            restaurant=rest_india_1,
            name="Butter Chicken",
            price=320,
            description="Creamy tomato-based curry with tender chicken pieces and aromatic spices",
        )

        Menu.objects.create(
            restaurant=rest_india_1,
            name="Chicken Biryani",
            price=280,
            description="Fragrant basmati rice cooked with marinated chicken and exotic spices",
        )

        Menu.objects.create(
            restaurant=rest_india_1,
            name="Paneer Tikka Masala",
            price=300,
            description="Grilled cottage cheese in rich tomato cream sauce",
        )

        Menu.objects.create(
            restaurant=rest_india_1,
            name="Garlic Naan",
            price=80,
            description="Fresh-baked flatbread topped with garlic and butter",
        )

        Menu.objects.create(
            restaurant=rest_india_1,
            name="Mango Lassi",
            price=100,
            description="Refreshing yogurt-based drink with sweet mango pulp",
        )

        # Delhi Delights (India) - 5 items
        Menu.objects.create(
            restaurant=rest_india_2,
            name="Rogan Josh",
            price=350,
            description="Aromatic lamb curry cooked in traditional Kashmiri style",
        )

        Menu.objects.create(
            restaurant=rest_india_2,
            name="Tandoori Chicken",
            price=320,
            description="Clay oven-roasted chicken marinated in yogurt and spices",
        )

        Menu.objects.create(
            restaurant=rest_india_2,
            name="Dal Makhani",
            price=220,
            description="Creamy black lentils slow-cooked with butter and cream",
        )

        Menu.objects.create(
            restaurant=rest_india_2,
            name="Aloo Paratha",
            price=120,
            description="Potato-stuffed flatbread served with yogurt and pickle",
        )

        Menu.objects.create(
            restaurant=rest_india_2,
            name="Gulab Jamun",
            price=90,
            description="Sweet milk-solid dumplings soaked in rose-flavored syrup",
        )

        # Bangalore Bistro (India) - 4 items
        Menu.objects.create(
            restaurant=rest_india_3,
            name="Masala Dosa",
            price=180,
            description="Crispy rice crepe filled with spiced potato masala",
        )

        Menu.objects.create(
            restaurant=rest_india_3,
            name="Idli Sambar",
            price=120,
            description="Steamed rice cakes served with lentil soup and chutney",
        )

        Menu.objects.create(
            restaurant=rest_india_3,
            name="Chicken Chettinad",
            price=340,
            description="Spicy South Indian chicken curry with black pepper and fennel",
        )

        Menu.objects.create(
            restaurant=rest_india_3,
            name="Filter Coffee",
            price=60,
            description="Traditional South Indian filter coffee with frothy milk",
        )

        # Kolkata Kitchen (India) - 4 items
        Menu.objects.create(
            restaurant=rest_india_4,
            name="Kolkata Biryani",
            price=300,
            description="Aromatic rice with tender meat, potatoes, and boiled eggs",
        )

        Menu.objects.create(
            restaurant=rest_india_4,
            name="Prawn Malai Curry",
            price=420,
            description="Prawns cooked in coconut milk with mild spices",
        )

        Menu.objects.create(
            restaurant=rest_india_4,
            name="Luchi & Aloo Dum",
            price=150,
            description="Deep-fried bread with spicy potato curry",
        )

        Menu.objects.create(
            restaurant=rest_india_4,
            name="Rasgulla",
            price=80,
            description="Spongy cottage cheese balls soaked in sugar syrup",
        )

        # New York Pizza (USA) - 5 items
        Menu.objects.create(
            restaurant=rest_usa_1,
            name="Pepperoni Pizza",
            price=15.99,
            description="Classic New York-style pizza with pepperoni and mozzarella",
        )

        Menu.objects.create(
            restaurant=rest_usa_1,
            name="Margherita Pizza",
            price=13.99,
            description="Fresh tomato sauce, mozzarella, and basil leaves",
        )

        Menu.objects.create(
            restaurant=rest_usa_1,
            name="Supreme Pizza",
            price=18.99,
            description="Loaded with sausage, peppers, onions, and mushrooms",
        )

        Menu.objects.create(
            restaurant=rest_usa_1,
            name="Buffalo Wings",
            price=11.99,
            description="Crispy chicken wings tossed in spicy buffalo sauce",
        )

        Menu.objects.create(
            restaurant=rest_usa_1,
            name="Caesar Salad",
            price=8.99,
            description="Romaine lettuce with parmesan, croutons, and Caesar dressing",
        )

        # Texas Burger House (USA) - 5 items
        Menu.objects.create(
            restaurant=rest_usa_2,
            name="Wagyu Burger",
            price=18.99,
            description="Premium wagyu beef patty with caramelized onions and special sauce",
        )

        Menu.objects.create(
            restaurant=rest_usa_2,
            name="BBQ Bacon Burger",
            price=16.99,
            description="Beef patty topped with BBQ sauce, bacon, and cheddar cheese",
        )

        Menu.objects.create(
            restaurant=rest_usa_2,
            name="Mushroom Swiss Burger",
            price=15.99,
            description="Beef burger with sautéed mushrooms and Swiss cheese",
        )

        Menu.objects.create(
            restaurant=rest_usa_2,
            name="Loaded Fries",
            price=7.99,
            description="Crispy fries topped with cheese, bacon, and ranch dressing",
        )

        Menu.objects.create(
            restaurant=rest_usa_2,
            name="Chocolate Milkshake",
            price=5.99,
            description="Rich and creamy chocolate milkshake with whipped cream",
        )

        # California Grill (USA) - 4 items
        Menu.objects.create(
            restaurant=rest_usa_3,
            name="Grilled Salmon",
            price=24.99,
            description="Fresh Atlantic salmon with lemon butter and seasonal vegetables",
        )

        Menu.objects.create(
            restaurant=rest_usa_3,
            name="Avocado Toast",
            price=12.99,
            description="Smashed avocado on sourdough with cherry tomatoes and feta",
        )

        Menu.objects.create(
            restaurant=rest_usa_3,
            name="California Sushi Roll",
            price=14.99,
            description="Crab, avocado, and cucumber wrapped in seaweed and rice",
        )

        Menu.objects.create(
            restaurant=rest_usa_3,
            name="Açai Bowl",
            price=11.99,
            description="Açai berry smoothie bowl topped with granola and fresh fruit",
        )

        # Chicago Steakhouse (USA) - 4 items
        Menu.objects.create(
            restaurant=rest_usa_4,
            name="Ribeye Steak",
            price=34.99,
            description="Prime 12oz ribeye steak with garlic mashed potatoes",
        )

        Menu.objects.create(
            restaurant=rest_usa_4,
            name="Filet Mignon",
            price=38.99,
            description="Tender 8oz filet with compound butter and asparagus",
        )

        Menu.objects.create(
            restaurant=rest_usa_4,
            name="Lobster Tail",
            price=42.99,
            description="Broiled lobster tail with drawn butter and lemon",
        )

        Menu.objects.create(
            restaurant=rest_usa_4,
            name="Creamed Spinach",
            price=8.99,
            description="Classic steakhouse side with rich cream sauce",
        )

        # London Fish & Chips (UK) - 4 items
        Menu.objects.create(
            restaurant=rest_uk_1,
            name="Classic Fish & Chips",
            price=12.99,
            description="Beer-battered cod with hand-cut chips and mushy peas",
        )

        Menu.objects.create(
            restaurant=rest_uk_1,
            name="Battered Sausage",
            price=8.99,
            description="Traditional British sausage in crispy batter",
        )

        Menu.objects.create(
            restaurant=rest_uk_1,
            name="Chicken Nuggets & Chips",
            price=9.99,
            description="Golden chicken nuggets with chips and curry sauce",
        )

        Menu.objects.create(
            restaurant=rest_uk_1,
            name="Pickled Onion",
            price=2.99,
            description="Traditional British accompaniment to fish and chips",
        )

        # Edinburgh Pub (UK) - 4 items
        Menu.objects.create(
            restaurant=rest_uk_2,
            name="Shepherd's Pie",
            price=14.99,
            description="Ground lamb with vegetables topped with mashed potatoes",
        )

        Menu.objects.create(
            restaurant=rest_uk_2,
            name="Bangers & Mash",
            price=13.99,
            description="Traditional pork sausages with mashed potatoes and gravy",
        )

        Menu.objects.create(
            restaurant=rest_uk_2,
            name="Scotch Egg",
            price=6.99,
            description="Hard-boiled egg wrapped in sausage meat and breadcrumbs",
        )

        Menu.objects.create(
            restaurant=rest_uk_2,
            name="Sticky Toffee Pudding",
            price=7.99,
            description="Moist sponge cake with toffee sauce and vanilla ice cream",
        )

        self.stdout.write("Creating payment methods...")
        PaymentMethod.objects.create(
            user=admin,
            card_last4="4242",
            type="credit_card",
        )

        PaymentMethod.objects.create(
            user=manager_india,
            card_last4="5555",
            type="debit_card",
        )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
