from django.conf import settings
from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=100)

    managers = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="managed_departments",
        blank=True,
    )

    def __str__(self):
        return self.name


class Unit(models.Model):
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="units",
    )

    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ("department", "name")

    def __str__(self):
        return f"{self.department.name} - {self.name}"

class EmployeeProfile(models.Model):

    ROLE_CHOICES = [
        ("staff_nurse", "Staff Nurse"),
        ("support_worker", "Support Worker"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="employee_profile",
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        related_name="employees",
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees",
    )

    role = models.CharField(
        max_length=30,
        choices=ROLE_CHOICES,
        blank=True,
        default="",
    )

    def __str__(self):
        return self.user.username

class Ward(models.Model):
    name = models.CharField(max_length=100)

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="wards",
    )

    managers = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="managed_wards",
        blank=True,
    )

    def __str__(self):
        return f"{self.name} | {self.department.name}"


class StaffProfile(models.Model):
    ROLE_CHOICES = [
        ("nurse", "Nurse"),
        ("support_worker", "Support Worker"),
    ]

    SHIFT_PREFERENCE_CHOICES = [
        ("day", "Day"),
        ("night", "Night"),
        ("both", "Both"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="staff_profile",
    )

    ward = models.ForeignKey(
        Ward,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="staff",
    )

    role = models.CharField(
        max_length=30,
        choices=ROLE_CHOICES,
    )

    shift_preference = models.CharField(
        max_length=10,
        choices=SHIFT_PREFERENCE_CHOICES,
        default="day",
    )

    def __str__(self):
        return f"{self.user.username} | {self.role}"


class Shift(models.Model):
    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="shifts",
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="shifts",
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="shifts",
    )

    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="assigned_shifts",
    )

    date = models.DateField()

    start_time = models.TimeField()

    end_time = models.TimeField()

    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )   

    class Meta:
        ordering = ["date", "start_time"]

    def __str__(self):
        return f"{self.employee} - {self.date}"