from django.urls import path
from .views import EstudianteListView, EstudianteDetailView

urlpatterns = [
    path('students/', EstudianteListView.as_view()),
    path('students/<int:pk>/', EstudianteDetailView.as_view()), 
]
