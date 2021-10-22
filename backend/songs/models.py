from django.db import models

# Create your models here.
class Song(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()

    def _str_(self):
        return self.title

class Book(models.Model):
    title = models.CharField(max_length=100)
    year = models.IntegerField()
    songs = models.ManyToManyField(Song, through="BookSongs")

    def _str_(self):
        return self.title

class BookSongs(models.Model):
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    index = models.IntegerField()
    variant = models.TextField(blank=True)