from django.shortcuts import render
from .serializers import SongSerializer, BookSerializer
from rest_framework import viewsets
from .models import Song, Book

# Create your views here.
class SongView(viewsets.ModelViewSet):
    serializer_class = SongSerializer
    queryset = Song.objects.all()

class BookView(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    queryset = Book.objects.all()