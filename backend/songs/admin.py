from django.contrib import admin
from .models import *

# Register your models here.
class SongAdmin(admin.ModelAdmin):
    list = ('title', 'text')

admin.site.register(Song, SongAdmin)
admin.site.register(Book)
admin.site.register(BookSongs)