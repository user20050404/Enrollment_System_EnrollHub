from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["student_id", "first_name", "last_name", "email"]
    ordering = ["last_name"]
    def get_queryset(self):
        return Student.objects.all()
