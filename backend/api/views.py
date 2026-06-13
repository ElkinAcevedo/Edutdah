from rest_framework import generics
from .models import Estudiante, EntradaBitacora
from .serializers import EstudianteSerializer, EntradaBitacoraSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .gemini import generar_o_recuperar_analisis,  chat_asistente



class EstudianteListView(generics.ListCreateAPIView):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer

class EstudianteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer


class EntradaBitacoraListView(generics.ListCreateAPIView):
    serializer_class = EntradaBitacoraSerializer

    def get_queryset(self):
        queryset = EntradaBitacora.objects.all()
        estudiante_id = self.request.query_params.get('student')
        if estudiante_id:
            queryset = queryset.filter(estudiante_id=estudiante_id)
        return queryset

class EntradaBitacoraDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EntradaBitacora.objects.all()
    serializer_class = EntradaBitacoraSerializer

@api_view(['GET'])
def analisis_bitacora(request):
    estudiante_id = request.query_params.get('student')
    if not estudiante_id:
        return Response({'error': 'Se requiere el parámetro student.'}, status=400)

    estudiante = get_object_or_404(Estudiante, pk=estudiante_id)
    resultado  = generar_o_recuperar_analisis(estudiante)
    return Response(resultado)

@api_view(['POST'])
def asistente_chat(request):
    estudiante_id = request.data.get('studentId')
    mensaje       = request.data.get('message')
    historial     = request.data.get('history', [])

    if not estudiante_id or not mensaje:
        return Response({'error': 'studentId y message son requeridos.'}, status=400)

    estudiante = get_object_or_404(Estudiante, pk=estudiante_id)
    respuesta  = chat_asistente(estudiante, mensaje, historial)
    return Response({'reply': respuesta})
