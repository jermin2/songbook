from rest_framework import serializers
from .models import Song, Book, BookSong

class SongSerializer(serializers.ModelSerializer):
    # song_id = serializers.IntegerField() # This needs to be uncommented if you want to overwrite during create

    class Meta:
        model = Song
        fields = ('song_id', 'title', 'lyrics', 'lang')

class BookSongSerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField()

    class Meta:
        model = BookSong
        fields = ('id', 'song_id', 'book_id', 'index')


class BookSerializer(serializers.ModelSerializer):
    songs = BookSongSerializer(source='booksong_set', many=True, required=False)
    # book_id = serializers.IntegerField() # This needs to be uncommented if you want to overwrite during create

    class Meta:
        model = Book
        fields = ('book_id', 'name', 'slug', 'lang', 'songs')