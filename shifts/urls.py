from rest_framework.routers import DefaultRouter

from .views import DepartmentViewSet, ShiftViewSet


router = DefaultRouter()

router.register(
    "departments",
    DepartmentViewSet,
    basename="department",
)

router.register(
    "shifts",
    ShiftViewSet,
    basename="shift",
)

urlpatterns = router.urls