from django.shortcuts import render
from .serializers import SongSerializer, BookSerializer
from rest_framework import viewsets
from .models import Song, Book, BookSongs
from django.views.decorators.csrf import csrf_exempt
import json

# from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from django.http import JsonResponse
from django.shortcuts import HttpResponse

# Create your views here.
class SongView(viewsets.ModelViewSet):
    serializer_class = SongSerializer
    queryset = Song.objects.all()

class BookViewReadOnly(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookSerializer
    queryset = Book.objects.all()

class BookView(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    queryset = Book.objects.all()

# @authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])
@api_view(['GET', 'PUT'])
def edit_song(request, id):  

    if request.user.is_anonymous:
        return JsonResponse({"data":request.method}, status=401)

    # Get new post data
    data = json.loads(request.body)
    print(data)

    song = Song.objects.get(id = int(data.get('id')))

    # Add or remove the song from the user's favourites
    try:
        song.title = data.get('title')
        song.text = data.get('text')
        song.save()

        return JsonResponse({ "content": "success"}, status=200)
    
    except:
        return JsonResponse({"fail":"fail"}, status=500)


# @authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])
@api_view(['GET', 'PUT'])
def edit_book(request, id):  

    if request.user.is_anonymous:
        return JsonResponse({"data":request.method}, status=401)

    # Get new post data
    data = json.loads(request.body)
    songs = data.get('songs')

    book = Book.objects.get(id = int(data.get('id')))

    # Delete all the songs in the book
    book.songs.clear()

    index = 1

    for song_id in songs:
        s = Song.objects.get(id=song_id)
        print(s.title)
        BookSongs.objects.create(
            book=book,
            song=s,
            index=index
        )

        index += 1
    #     book.songs.add(s)

    book.save()

    return JsonResponse({ "content": "success"}, status=200)
