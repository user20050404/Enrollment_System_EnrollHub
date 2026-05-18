import os

def write(path, content):
    d = os.path.dirname(path)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Created: ' + path)

# students
write('apps/students/serializers.py',
'from rest_framework import serializers\n'
'from .models import Student\n'
'\n'
'class StudentSerializer(serializers.ModelSerializer):\n'
'    full_name = serializers.ReadOnlyField()\n'
'    total_enrolled_units = serializers.ReadOnlyField()\n'
'    class Meta:\n'
'        model = Student\n'
'        fields = "__all__"\n'
'        read_only_fields = ["id", "created_at", "updated_at"]\n'
)

write('apps/students/views.py',
'from rest_framework import viewsets, filters\n'
'from rest_framework.permissions import IsAuthenticated\n'
'from .models import Student\n'
'from .serializers import StudentSerializer\n'
'\n'
'class StudentViewSet(viewsets.ModelViewSet):\n'
'    serializer_class = StudentSerializer\n'
'    permission_classes = [IsAuthenticated]\n'
'    filter_backends = [filters.SearchFilter, filters.OrderingFilter]\n'
'    search_fields = ["student_id", "first_name", "last_name", "email"]\n'
'    ordering = ["last_name"]\n'
'    def get_queryset(self):\n'
'        return Student.objects.all()\n'
)

write('apps/students/urls.py',
'from django.urls import path, include\n'
'from rest_framework.routers import DefaultRouter\n'
'from .views import StudentViewSet\n'
'\n'
'router = DefaultRouter()\n'
'router.register(r"", StudentViewSet, basename="students")\n'
'urlpatterns = [path("", include(router.urls))]\n'
)

# subjects
write('apps/subjects/serializers.py',
'from rest_framework import serializers\n'
'from .models import Subject\n'
'\n'
'class SubjectSerializer(serializers.ModelSerializer):\n'
'    class Meta:\n'
'        model = Subject\n'
'        fields = "__all__"\n'
'        read_only_fields = ["id", "created_at"]\n'
)

write('apps/subjects/views.py',
'from rest_framework import viewsets, filters\n'
'from rest_framework.permissions import IsAuthenticated\n'
'from .models import Subject\n'
'from .serializers import SubjectSerializer\n'
'\n'
'class SubjectViewSet(viewsets.ModelViewSet):\n'
'    serializer_class = SubjectSerializer\n'
'    permission_classes = [IsAuthenticated]\n'
'    filter_backends = [filters.SearchFilter]\n'
'    search_fields = ["code", "name"]\n'
'    def get_queryset(self):\n'
'        return Subject.objects.all()\n'
)

write('apps/subjects/urls.py',
'from django.urls import path, include\n'
'from rest_framework.routers import DefaultRouter\n'
'from .views import SubjectViewSet\n'
'\n'
'router = DefaultRouter()\n'
'router.register(r"", SubjectViewSet, basename="subjects")\n'
'urlpatterns = [path("", include(router.urls))]\n'
)

# sections
write('apps/sections/serializers.py',
'from rest_framework import serializers\n'
'from .models import Section\n'
'\n'
'class SectionSerializer(serializers.ModelSerializer):\n'
'    subject_code = serializers.CharField(source="subject.code", read_only=True)\n'
'    subject_name = serializers.CharField(source="subject.name", read_only=True)\n'
'    enrolled_count = serializers.ReadOnlyField()\n'
'    available_slots = serializers.ReadOnlyField()\n'
'    is_full = serializers.ReadOnlyField()\n'
'    class Meta:\n'
'        model = Section\n'
'        fields = "__all__"\n'
'        read_only_fields = ["id", "created_at"]\n'
)

write('apps/sections/views.py',
'from rest_framework import viewsets, filters\n'
'from rest_framework.permissions import IsAuthenticated\n'
'from .models import Section\n'
'from .serializers import SectionSerializer\n'
'\n'
'class SectionViewSet(viewsets.ModelViewSet):\n'
'    serializer_class = SectionSerializer\n'
'    permission_classes = [IsAuthenticated]\n'
'    filter_backends = [filters.SearchFilter]\n'
'    search_fields = ["name", "subject__code"]\n'
'    def get_queryset(self):\n'
'        return Section.objects.select_related("subject").all()\n'
)

write('apps/sections/urls.py',
'from django.urls import path, include\n'
'from rest_framework.routers import DefaultRouter\n'
'from .views import SectionViewSet\n'
'\n'
'router = DefaultRouter()\n'
'router.register(r"", SectionViewSet, basename="sections")\n'
'urlpatterns = [path("", include(router.urls))]\n'
)

# enrollments
write('apps/enrollments/serializers.py',
'from rest_framework import serializers\n'
'from .models import Enrollment\n'
'\n'
'class EnrollmentSerializer(serializers.ModelSerializer):\n'
'    class Meta:\n'
'        model = Enrollment\n'
'        fields = "__all__"\n'
'        read_only_fields = ["id", "enrolled_at", "updated_at"]\n'
'\n'
'    def validate(self, attrs):\n'
'        section = attrs.get("section")\n'
'        student = attrs.get("student")\n'
'        status = attrs.get("status", "enrolled")\n'
'        if status == "enrolled" and section and section.is_full:\n'
'            raise serializers.ValidationError({"section": "This section is already full."})\n'
'        if student and section and status == "enrolled":\n'
'            dup = Enrollment.objects.filter(\n'
'                student=student,\n'
'                section__subject=section.subject,\n'
'                status="enrolled"\n'
'            ).exists()\n'
'            if dup:\n'
'                raise serializers.ValidationError({"student": "Already enrolled in " + section.subject.name + "."})\n'
'        return attrs\n'
)

write('apps/enrollments/urls.py',
'from django.urls import path, include\n'
'from rest_framework.routers import DefaultRouter\n'
'from .views import EnrollmentViewSet\n'
'\n'
'router = DefaultRouter()\n'
'router.register(r"", EnrollmentViewSet, basename="enrollments")\n'
'urlpatterns = [path("", include(router.urls))]\n'
)

print('\nAll files created successfully!')