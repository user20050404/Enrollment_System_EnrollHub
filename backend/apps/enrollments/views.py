# apps/enrollments/serializers.py
from rest_framework import serializers
from .models import Enrollment
from apps.students.serializers import StudentSerializer
from apps.sections.serializers import SectionSerializer


class EnrollmentSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    section_detail = SectionSerializer(source='section', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'section', 'status', 'enrolled_at',
                  'updated_at', 'remarks', 'student_detail', 'section_detail']
        read_only_fields = ['id', 'enrolled_at', 'updated_at']

    def validate(self, attrs):
        section = attrs.get('section')
        student = attrs.get('student')
        status = attrs.get('status', 'enrolled')

        if status == 'enrolled' and section and section.is_full:
            raise serializers.ValidationError(
                {'section': f'This section is full ({section.max_students} max).'}
            )

        if student and section and status == 'enrolled':
            dup = Enrollment.objects.filter(
                student=student,
                section__subject=section.subject,
                status='enrolled'
            ).exists()
            if dup:
                raise serializers.ValidationError(
                    {'student': f'Already enrolled in {section.subject.name}.'}
                )

        return attrs


# apps/enrollments/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from .models import Enrollment
from .serializers import EnrollmentSerializer
from apps.students.models import Student


class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Enrollment.objects.select_related(
            'student', 'section', 'section__subject'
        )
        student_id = self.request.query_params.get('student')
        section_id = self.request.query_params.get('section')
        status_filter = self.request.query_params.get('status')
        if student_id:
            qs = qs.filter(student_id=student_id)
        if section_id:
            qs = qs.filter(section_id=section_id)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        student_id = request.query_params.get('student')
        if not student_id:
            return Response({'error': 'student query param required.'}, status=400)
        try:
            student = Student.objects.get(pk=student_id)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found.'}, status=404)

        enrollments = Enrollment.objects.filter(
            student=student, status='enrolled'
        ).select_related('section__subject')

        return Response({
            'student': str(student),
            'total_subjects': enrollments.count(),
            'total_units': sum(e.section.subject.units for e in enrollments),
            'enrollments': EnrollmentSerializer(enrollments, many=True).data,
        })

    @action(detail=False, methods=['get'], url_path='dashboard-stats')
    def dashboard_stats(self, request):
        return Response({
            'total_students': Student.objects.count(),
            'total_enrollments': Enrollment.objects.filter(status='enrolled').count(),
            'dropped': Enrollment.objects.filter(status='dropped').count(),
            'completed': Enrollment.objects.filter(status='completed').count(),
        })
