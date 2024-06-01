from django.contrib import admin
from .models import Product, Variant, SubVariant

class SubVariantInline(admin.TabularInline):
    model = SubVariant
    extra = 1

class VariantInline(admin.TabularInline):
    model = Variant
    extra = 1
    inlines = [SubVariantInline]

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('ProductID', 'ProductCode', 'ProductName', 'TotalStock', 'CreatedDate', 'UpdatedDate', 'Active')
    search_fields = ('ProductName', 'ProductCode', 'ProductID')
    list_filter = ('Active', 'CreatedDate', 'UpdatedDate')
    inlines = [VariantInline]

@admin.register(Variant)
class VariantAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'name')
    search_fields = ('name',)
    list_filter = ('product',)

@admin.register(SubVariant)
class SubVariantAdmin(admin.ModelAdmin):
    list_display = ('id', 'variant', 'name', 'stock')
    search_fields = ('name',)
    list_filter = ('variant',)
