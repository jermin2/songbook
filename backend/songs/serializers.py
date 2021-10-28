from rest_framework import serializers
from .models import Song, Book, BookSongs

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('song_id', 'title', 'text')

class BookSongsSerializer(serializers.ModelSerializer):

    class Meta:
        model = BookSongs
        fields = ('id', 'song_id', 'book_id', 'index')


class BookSerializer(serializers.ModelSerializer):
    songs = BookSongsSerializer(source='booksongs_set', many=True, required=False)

    class Meta:
        model = Book
        fields = ('book_id', 'title', 'year', 'songs')