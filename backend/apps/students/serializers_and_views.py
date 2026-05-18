# apps/students/serializers.py
from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    total_enrolled_units = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = [
            'id', 'student_id', 'first_name', 'last_name', 'full_name',
            'email', 'contact_number', 'address', 'photo',
            'year_level', 'course', 'is_active',
            'total_enrolled_units', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_student_id(self, value):
        if not value.strip():
            raise serializers.ValidationError("Student ID cannot be blank.")
        return value.upper().strip()

    def validate_email(self, value):
        return value.lower().strip()


# apps/students/views.py
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['student_id', 'first_name', 'last_name', 'email', 'course']
    ordering_fields = ['last_name', 'student_id', 'created_at']
    ordering = ['last_name']

    def get_queryset(self):
        qs = Student.objects.all()
        is_active = self.request.query_params.get('is_active')
        year_level = self.request.query_params.get('year_level')
        course = self.request.query_params.get('course')
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        if year_level:
            qs = qs.filter(year_level=year_level)
        if course:
            qs = qs.filter(course__icontains=course)
        return qs


# apps/students/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet

router = DefaultRouter()
router.register(r'', StudentViewSet, basename='students')
urlpatterns = [path('', include(router.urls))]
