# apps/subjects/models.py
from django.db import models
import uuid


class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    units = models.PositiveIntegerField()
    year_level = models.IntegerField(choices=[(i, f'Year {i}') for i in range(1, 6)])
    semester = models.IntegerField(choices=[(1, '1st Semester'), (2, '2nd Semester'), (3, 'Summer')])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['code']

    def __str__(self):
        return f'{self.code} - {self.name}'


# apps/sections/models.py
class Section(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)  # e.g., 'A', 'B', 'Section 1'
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='sections')
    max_students = models.PositiveIntegerField(default=40)
    room = models.CharField(max_length=50, blank=True)
    schedule = models.CharField(max_length=100, blank=True)  # e.g., 'MWF 7:30-9:00 AM'
    instructor = models.CharField(max_length=100, blank=True)
    school_year = models.CharField(max_length=20)  # e.g., '2024-2025'
    semester = models.IntegerField(choices=[(1, '1st'), (2, '2nd'), (3, 'Summer')])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['subject__code', 'name']
        unique_together = ['subject', 'name', 'school_year', 'semester']

    def __str__(self):
        return f'{self.subject.code} - {self.name}'

    @property
    def enrolled_count(self):
        return self.enrollments.filter(status='enrolled').count()

    @property
    def available_slots(self):
        return self.max_students - self.enrolled_count

    @property
    def is_full(self):
        return self.enrolled_count >= self.max_students
