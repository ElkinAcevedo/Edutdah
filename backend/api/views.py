from rest_framework import generics
from .models import Estudiante
from .serializers import EstudianteSerializer

class EstudianteListView(generics.ListCreateAPIView):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer

class EstudianteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer
