from django.contrib import admin
from .models import Song

# Register your models here.
class SongAdmin(admin.ModelAdmin):
    list = ('title', 'text')

admin.site.register(Song, SongAdmin)