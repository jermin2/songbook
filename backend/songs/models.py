from django.db import models

# Create your models here.
class Song(models.Model):
    song_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=100) 
    lyrics = models.TextField()
    lang = models.CharField(max_length=20, default="english")

    def _str_(self):
        return self.title

class Book(models.Model):
    book_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    lang = models.CharField(max_length=20, default="english")
    slug = models.CharField(max_length=50)
    songs = models.ManyToManyField(Song, related_name="books", through="BookSong")

    def _str_(self):
        return self.title

class BookSong(models.Model):
    song_id = models.ForeignKey(Song, on_delete=models.CASCADE)
    book_id = models.ForeignKey(Book, on_delete=models.CASCADE)
    index = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['song_id', 'book_id'], name='unique_song_in_book')
        ]

class PrintPage(models.Model):
    name = models.CharField(max_length=100)
    lyrics = models.TextField()
    style = models.TextField(null=True, blank=True)
    book_id = models.ForeignKey(Book, on_delete=models.CASCADE, null=True)