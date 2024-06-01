from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Product, SubVariant
from .serializers import ProductSerializer
from rest_framework.exceptions import ValidationError

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @action(detail=True, methods=['post'])
    def add_stock(self, request, pk=None):
        product = self.get_object()
        sub_variant_id = request.data.get('sub_variant_id')
        stock_to_add = request.data.get('stock', 0)

        if not sub_variant_id or stock_to_add is None:
            raise ValidationError("SubVariant ID and stock are required.")

        sub_variant = get_object_or_404(SubVariant, id=sub_variant_id, variant__product=product)
        sub_variant.stock += stock_to_add
        sub_variant.save()

        product.TotalStock += stock_to_add
        product.save()

        return Response({'status': 'stock added'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def remove_stock(self, request, pk=None):
        product = self.get_object()
        sub_variant_id = request.data.get('sub_variant_id')
        stock_to_remove = request.data.get('stock', 0)

        if not sub_variant_id or stock_to_remove is None:
            raise ValidationError("SubVariant ID and stock are required.")

        sub_variant = get_object_or_404(SubVariant, id=sub_variant_id, variant__product=product)
        if sub_variant.stock < stock_to_remove:
            raise ValidationError("Not enough stock to remove.")

        sub_variant.stock -= stock_to_remove
        sub_variant.save()

        product.TotalStock -= stock_to_remove
        product.save()

        return Response({'status': 'stock removed'}, status=status.HTTP_200_OK)
    
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['delete'])
    def delete(self, request, pk=None):
        product = self.get_object()
        product.delete()
        return Response({'status': 'product deleted'}, status=status.HTTP_204_NO_CONTENT)
