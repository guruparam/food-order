from django.contrib import admin
from .models import User, Restaurant, Menu, Order, OrderItem, PaymentMethod


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "role", "country", "is_active")
    list_filter = ("role", "country", "is_active")
    search_fields = ("email", "name")


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ("name", "country", "created_at")
    list_filter = ("country",)
    search_fields = ("name",)


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ("name", "restaurant", "price", "created_at")
    list_filter = ("restaurant__country",)
    search_fields = ("name", "restaurant__name")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "restaurant", "total_amount", "status", "created_at")
    list_filter = ("status", "restaurant__country")
    search_fields = ("user__email", "restaurant__name")
    inlines = [OrderItemInline]


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ("user", "type", "card_last4", "created_at")
    list_filter = ("type",)
    search_fields = ("user__email", "card_last4")
