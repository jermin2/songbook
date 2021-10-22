from django.contrib import admin
from .models import *

# Register your models here.
class SongAdmin(admin.ModelAdmin):
    list = ('title', 'text')

class BookAdmin(admin.ModelAdmin):
    list = ('title', 'year', 'songs')

admin.site.register(Song, SongAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(BookSongs)