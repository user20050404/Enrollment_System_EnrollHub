# apps/sections/serializers.py
from rest_framework import serializers
from .models import Section
from apps.subjects.models import Subject


class SectionSerializer(serializers.ModelSerializer):
    subject_code = serializers.CharField(source='subject.code', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    enrolled_count = serializers.ReadOnlyField()
    available_slots = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()

    class Meta:
        model = Section
        fields = [
            'id', 'name', 'subject', 'subject_code', 'subject_name',
            'max_students', 'room', 'schedule', 'instructor',
            'school_year', 'semester', 'is_active',
            'enrolled_count', 'available_slots', 'is_full', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_max_students(self, value):
        if value < 1:
            raise serializers.ValidationError("Max students must be at least 1.")
        if value > 200:
            raise serializers.ValidationError("Max students cannot exceed 200.")
        return value

    def validate(self, attrs):
        # Ensure section name + subject + year + semester is unique
        subject = attrs.get('subject')
        name = attrs.get('name')
        school_year = attrs.get('school_year')
        semester = attrs.get('semester')
        qs = Section.objects.filter(
            subject=subject, name=name, school_year=school_year, semester=semester
        )
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A section with this name already exists for this subject, year, and semester.")
        return attrs


# apps/sections/views.py
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Section
from .serializers import SectionSerializer


class SectionViewSet(viewsets.ModelViewSet):
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'subject__code', 'subject__name', 'instructor']
    ordering_fields = ['subject__code', 'name', 'created_at']
    ordering = ['subject__code', 'name']

    def get_queryset(self):
        qs = Section.objects.select_related('subject').all()
        subject_id = self.request.query_params.get('subject')
        school_year = self.request.query_params.get('school_year')
        semester = self.request.query_params.get('semester')
        is_active = self.request.query_params.get('is_active')
        if subject_id:
            qs = qs.filter(subject_id=subject_id)
        if school_year:
            qs = qs.filter(school_year=school_year)
        if semester:
            qs = qs.filter(semester=semester)
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        return qs


# apps/sections/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SectionViewSet

router = DefaultRouter()
router.register(r'', SectionViewSet, basename='sections')
urlpatterns = [path('', include(router.urls))]
