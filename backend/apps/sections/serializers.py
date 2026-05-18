from rest_framework import serializers
from .models import Section

class SectionSerializer(serializers.ModelSerializer):
    subject_code = serializers.CharField(source="subject.code", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    enrolled_count = serializers.ReadOnlyField()
    available_slots = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    class Meta:
        model = Section
        fields = "__all__"
        read_only_fields = ["id", "created_at"]
