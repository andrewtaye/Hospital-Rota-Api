from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Department, Shift
from .serializers import DepartmentSerializer, ShiftSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.groups.filter(name="Managers").exists():
            return Department.objects.filter(managers=user)

        return Department.objects.none()


class ShiftViewSet(viewsets.ModelViewSet):
    serializer_class = ShiftSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.groups.filter(name="Managers").exists():
            return Shift.objects.filter(
                department__managers=user
            ).distinct()

        return Shift.objects.filter(employee=user)

    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user)