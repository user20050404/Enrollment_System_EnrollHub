# apps/enrollments/models.py
from django.db import models
from django.core.exceptions import ValidationError
import uuid


class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('dropped', 'Dropped'),
        ('completed', 'Completed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        'students.Student', on_delete=models.CASCADE, related_name='enrollments'
    )
    section = models.ForeignKey(
        'sections.Section', on_delete=models.CASCADE, related_name='enrollments'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='enrolled')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    remarks = models.TextField(blank=True)

    class Meta:
        ordering = ['-enrolled_at']
        unique_together = ['student', 'section']  # Prevent duplicate enrollment

    def __str__(self):
        return f'{self.student} → {self.section}'

    def clean(self):
        # Check section capacity
        if self.status == 'enrolled':
            count = Enrollment.objects.filter(
                section=self.section, status='enrolled'
            ).exclude(pk=self.pk).count()
            if count >= self.section.max_students:
                raise ValidationError(
                    f'Section {self.section} is full. '
                    f'Max capacity: {self.section.max_students}'
                )
        # Prevent duplicate enrollment in same subject (different section)
        if self.status == 'enrolled':
            duplicate = Enrollment.objects.filter(
                student=self.student,
                section__subject=self.section.subject,
                status='enrolled'
            ).exclude(pk=self.pk).exists()
            if duplicate:
                raise ValidationError(
                    f'Student is already enrolled in {self.section.subject.name}.'
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
