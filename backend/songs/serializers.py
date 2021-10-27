from rest_framework import serializers
from .models import Song, Book, BookSongs

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('id', 'title', 'text')

class BookSongsSerializer(serializers.ModelSerializer):
    song_id = serializers.ReadOnlyField(source='song.id')
    book_id = serializers.ReadOnlyField(source='book.id')

    class Meta:
        model = BookSongs
        fields = '__all__'


class BookSerializer(serializers.ModelSerializer):
    songs = BookSongsSerializer(source='booksongs_set', many=True)
    class Meta:
        model = Book
        fields = ('id', 'title', 'year', 'songs')