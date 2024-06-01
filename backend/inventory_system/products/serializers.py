from rest_framework import serializers
from .models import Product, Variant, SubVariant

class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariant
        fields = ['id', 'name', 'stock']

class VariantSerializer(serializers.ModelSerializer):
    sub_variants = SubVariantSerializer(many=True)

    class Meta:
        model = Variant
        fields = ['id', 'name', 'sub_variants']

class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'ProductID', 'ProductCode', 'ProductName', 'ProductImage', 'CreatedDate', 'UpdatedDate', 'CreatedUser', 'IsFavourite', 'Active', 'HSNCode', 'TotalStock', 'variants']

    def create(self, validated_data):
        variants_data = validated_data.pop('variants')
        product = Product.objects.create(**validated_data)
        for variant_data in variants_data:
            sub_variants_data = variant_data.pop('sub_variants')
            variant = Variant.objects.create(product=product, **variant_data)
            for sub_variant_data in sub_variants_data:
                SubVariant.objects.create(variant=variant, **sub_variant_data)
        return product

    def update(self, instance, validated_data):
        instance.ProductID = validated_data.get('ProductID', instance.ProductID)
        instance.ProductCode = validated_data.get('ProductCode', instance.ProductCode)
        instance.ProductName = validated_data.get('ProductName', instance.ProductName)
        instance.ProductImage = validated_data.get('ProductImage', instance.ProductImage)
        instance.CreatedDate = validated_data.get('CreatedDate', instance.CreatedDate)
        instance.UpdatedDate = validated_data.get('UpdatedDate', instance.UpdatedDate)
        instance.CreatedUser = validated_data.get('CreatedUser', instance.CreatedUser)
        instance.IsFavourite = validated_data.get('IsFavourite', instance.IsFavourite)
        instance.Active = validated_data.get('Active', instance.Active)
        instance.HSNCode = validated_data.get('HSNCode', instance.HSNCode)
        instance.TotalStock = validated_data.get('TotalStock', instance.TotalStock)
        instance.save()

        # Handle variant and sub-variant updates
        variants_data = validated_data.get('variants', [])
        for variant_data in variants_data:
            variant_id = variant_data.get('id')
            sub_variants_data = variant_data.pop('sub_variants', [])
            if variant_id:
                # If variant exists, update it
                variant_instance = instance.variants.get(id=variant_id)
                variant_instance.name = variant_data.get('name', variant_instance.name)
                variant_instance.save()
            else:
                # If variant does not exist, create it
                variant_instance = Variant.objects.create(product=instance, **variant_data)

            # Handle sub-variant updates
            for sub_variant_data in sub_variants_data:
                sub_variant_id = sub_variant_data.get('id')
                if sub_variant_id:
                    # If sub-variant exists, update it
                    sub_variant_instance = variant_instance.sub_variants.get(id=sub_variant_id)
                    sub_variant_instance.name = sub_variant_data.get('name', sub_variant_instance.name)
                    sub_variant_instance.stock = sub_variant_data.get('stock', sub_variant_instance.stock)
                    sub_variant_instance.save()
                else:
                    # If sub-variant does not exist, create it
                    SubVariant.objects.create(variant=variant_instance, **sub_variant_data)

        return instance
