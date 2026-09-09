from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    CurrentUserView,
    DepartmentViewSet,
    EmployeeProfileViewSet,
    ShiftViewSet,
    UnitViewSet,
)

router = DefaultRouter()

router.register(
    "departments",
    DepartmentViewSet,
    basename="department",
)

router.register(
    "units",
    UnitViewSet,
    basename="unit",
)

router.register(
    "employees",
    EmployeeProfileViewSet,
    basename="employee",
)

router.register(
    "shifts",
    ShiftViewSet,
    basename="shift",
)

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current-user"),
]

urlpatterns += router.urls