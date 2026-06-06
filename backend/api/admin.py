from django.contrib import admin
from .models import (
    Usuario,
    Estudiante,
    MaterialAdaptado,
    EntradaBitacora,
    Estrategia,
)

admin.site.register(Usuario)
admin.site.register(Estudiante)
admin.site.register(MaterialAdaptado)
admin.site.register(EntradaBitacora)
admin.site.register(Estrategia)
