from django.db import models
import uuid

class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    units = models.PositiveIntegerField()
    year_level = models.IntegerField(choices=[(i, f"Year {i}") for i in range(1, 6)])
    semester = models.IntegerField(choices=[(1, "1st Semester"), (2, "2nd Semester"), (3, "Summer")])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.name}"
