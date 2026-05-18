from rest_framework import serializers
from .models import Enrollment

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"
        read_only_fields = ["id", "enrolled_at", "updated_at"]

    def validate(self, attrs):
        section = attrs.get("section")
        student = attrs.get("student")
        status = attrs.get("status", "enrolled")
        if status == "enrolled" and section and section.is_full:
            raise serializers.ValidationError({"section": "This section is already full."})
        if student and section and status == "enrolled":
            dup = Enrollment.objects.filter(
                student=student,
                section__subject=section.subject,
                status="enrolled"
            ).exists()
            if dup:
                raise serializers.ValidationError({"student": "Already enrolled in " + section.subject.name + "."})
        return attrs
