from django.contrib import admin

from .models import (
    Department,
    EmployeeProfile,
    Shift,
    StaffProfile,
    Unit,
    Ward,
)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
    ]

    search_fields = [
        "name",
    ]

    filter_horizontal = [
        "managers",
    ]


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "department",
    ]

    list_filter = [
        "department",
    ]

    search_fields = [
        "name",
        "department__name",
    ]


@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "department",
    ]

    list_filter = [
        "department",
    ]

    search_fields = [
        "name",
        "department__name",
    ]

    filter_horizontal = [
        "managers",
    ]


@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "department",
        "unit",
        "role",
    ]

    list_filter = [
        "department",
        "unit",
        "role",
    ]

    search_fields = [
        "user__username",
    ]


@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "ward",
        "role",
        "shift_preference",
    ]

    list_filter = [
        "ward",
        "role",
        "shift_preference",
    ]

    search_fields = [
        "user__username",
        "ward__name",
    ]


@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "employee",
        "department",
        "unit",
        "assigned_by",
        "date",
        "start_time",
        "end_time",
    ]

    list_filter = [
        "department",
        "unit",
        "date",
    ]

    search_fields = [
        "employee__username",
        "department__name",
        "unit__name",
        "assigned_by__username",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]