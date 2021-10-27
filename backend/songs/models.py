from django.db import models

# Create your models here.
class Song(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()

    def _str_(self):
        return self.title

class Book(models.Model):
    title = models.CharField(max_length=100)
    year = models.IntegerField(null=True,blank=True)
    songs = models.ManyToManyField(Song, related_name="books", through="BookSongs")

    def _str_(self):
        return self.title

class BookSongs(models.Model):
    song_id = models.ForeignKey(Song, on_delete=models.CASCADE)
    book_id = models.ForeignKey(Book, on_delete=models.CASCADE)
    index = models.IntegerField(null=True,blank=True)
    variant = models.TextField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['song_id', 'book_id'], name='unique_song_in_book')
        ]
