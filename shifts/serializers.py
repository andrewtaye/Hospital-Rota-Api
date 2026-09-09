from rest_framework import serializers

from .models import (
    Department,
    EmployeeProfile,
    Shift,
    Unit,
)


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = "__all__"


class EmployeeProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    department_name = serializers.CharField(
        source="department.name",
        read_only=True,
    )

    unit_name = serializers.CharField(
        source="unit.name",
        read_only=True,
    )

    role_name = serializers.CharField(
        source="get_role_display",
        read_only=True,
    )

    class Meta:
        model = EmployeeProfile

        fields = [
            "id",
            "user",
            "username",

            "department",
            "department_name",

            "unit",
            "unit_name",

            "role",
            "role_name",
        ]


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = "__all__"

    def validate(self, data):
        department = data.get("department")
        unit = data.get("unit")

        if unit and unit.department != department:
            raise serializers.ValidationError(
                {
                    "unit": (
                        "The selected unit does not belong "
                        "to the selected department."
                    )
                }
            )

        return data