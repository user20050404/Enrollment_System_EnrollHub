from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Section
from .serializers import SectionSerializer

class SectionViewSet(viewsets.ModelViewSet):
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "subject__code"]
    def get_queryset(self):
        return Section.objects.select_related("subject").all()
