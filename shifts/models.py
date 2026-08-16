
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


class Shift(models.Model):
    COMPLETION_STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("left_early", "Left Early"),
        ("sick", "Left Sick"),
        ("absent", "Absent"),
        ("cancelled", "Cancelled"),
    ]

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

    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="assigned_shifts",
    )

    date = models.DateField()

    start_time = models.TimeField()

    end_time = models.TimeField()

    actual_start_time = models.TimeField(
        blank=True,
        null=True,
    )

    actual_end_time = models.TimeField(
        blank=True,
        null=True,
    )

    completion_status = models.CharField(
        max_length=30,
        choices=COMPLETION_STATUS_CHOICES,
        default="scheduled",
    )

    notes = models.TextField(
        blank=True,
    )

    attendance_notes = models.TextField(
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
        return (
            f"{self.employee.username} | "
            f"{self.department.name} | "
            f"{self.date}"
        )

