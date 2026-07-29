from django.contrib import admin

from .models import Department, Shift


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]
    search_fields = ["name"]
    filter_horizontal = ["managers"]


@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "employee",
        "department",
        "assigned_by",
        "date",
        "start_time",
        "end_time",
    ]

    list_filter = [
        "department",
        "date",
    ]

    search_fields = [
        "employee__username",
        "department__name",
        "assigned_by__username",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]