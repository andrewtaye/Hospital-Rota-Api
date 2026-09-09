from django.contrib.auth import get_user_model

from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Department, EmployeeProfile, Shift, StaffProfile , Unit
from .serializers import (
    DepartmentSerializer,
    EmployeeProfileSerializer,
    ShiftSerializer,
    UnitSerializer,
)

User = get_user_model()


# --------------------------------------------------
# Current logged-in user
# --------------------------------------------------

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        is_manager = Department.objects.filter(
            managers=user
        ).exists()

        role = "employee"
        ward = None

        try:
            staff_profile = user.staff_profile

            role = staff_profile.role

            if staff_profile.ward:
                ward = {
                    "id": staff_profile.ward.id,
                    "name": staff_profile.ward.name,
                    "department": staff_profile.ward.department.name,
                }

        except StaffProfile.DoesNotExist:
            try:
                employee_profile = user.employee_profile
                role = employee_profile.role

            except EmployeeProfile.DoesNotExist:
                role = "manager" if is_manager else "employee"

        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": role,
            "is_manager": is_manager,
            "ward": ward,
        })


# --------------------------------------------------
# Departments
# --------------------------------------------------

class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Department.objects.filter(
            managers=user
        ).distinct()


# --------------------------------------------------
# Units
# --------------------------------------------------

class UnitViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UnitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Unit.objects.filter(
            department__managers=user
        ).distinct()


# --------------------------------------------------
# Shifts
# --------------------------------------------------

class ShiftViewSet(viewsets.ModelViewSet):
    serializer_class = ShiftSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Shift.objects
            .all()
            .select_related(
                "employee",
                "department",
                "unit",
                "assigned_by",
            )
            .order_by(
                "date",
                "start_time",
            )
        )

    def perform_create(self, serializer):
        user = self.request.user

        department = serializer.validated_data.get(
            "department"
        )

        unit = serializer.validated_data.get(
            "unit"
        )

        employee = serializer.validated_data.get(
            "employee"
        )

        if not department.managers.filter(
            id=user.id
        ).exists():
            raise PermissionDenied(
                "You are not a manager of this department."
            )

        try:
            employee_profile = EmployeeProfile.objects.get(
                user=employee
            )

        except EmployeeProfile.DoesNotExist:
            raise PermissionDenied(
                "This employee does not have an employee profile."
            )

        if employee_profile.department != department:
            raise PermissionDenied(
                "This employee does not belong to this department."
            )

        if unit:
            if employee_profile.unit != unit:
                raise PermissionDenied(
                    "This employee does not belong to this unit."
                )

        serializer.save(
            assigned_by=user
        )


# --------------------------------------------------
# Employees
# --------------------------------------------------

class EmployeeProfileViewSet(
    viewsets.ReadOnlyModelViewSet
):
    serializer_class = EmployeeProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        queryset = (
            EmployeeProfile.objects
            .filter(
                department__managers=user
            )
            .select_related(
                "user",
                "department",
                "unit",
            )
            .distinct()
        )

        department_id = self.request.query_params.get(
            "department"
        )

        unit_id = self.request.query_params.get(
            "unit"
        )

        if department_id:
            queryset = queryset.filter(
                department_id=department_id
            )

        if unit_id:
            queryset = queryset.filter(
                unit_id=unit_id
            )

        return queryset