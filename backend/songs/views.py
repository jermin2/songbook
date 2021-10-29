from django.shortcuts import render
from .serializers import SongSerializer, BookSerializer, BookSongSerializer
from rest_framework import viewsets, permissions
from .models import Song, Book, BookSong
from django.views.decorators.csrf import csrf_exempt
import json

# from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from rest_framework.decorators import action

from django.http import JsonResponse
from django.shortcuts import HttpResponse

# Create your views here.
class SongView(viewsets.ModelViewSet):
    serializer_class = SongSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Song.objects.all()

class BookSongView(viewsets.ModelViewSet):
    serializer_class = BookSongSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = BookSong.objects.all()    

class BookView(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
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

    song = Song.objects.get(song_id = int(data.get('song_id')))

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

    book = Book.objects.get(book_id = int(data.get('book_id')))

    # Delete all the songs in the book
    book.songs.clear()

    index = 1

    for songObj in songs:
        print(songObj)
        s = Song.objects.get(song_id=songObj.get('song_id'))
        print(s.title)
        BookSongs.objects.create(
            book_id=book,
            song_id=s,
            index=index
        )

        index += 1
    #     book.songs.add(s)

    book.save()

    return JsonResponse({ "content": "success"}, status=200)
