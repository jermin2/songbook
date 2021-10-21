from django.db import models

# Create your models here.
class Song(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()

    def _str_(self):
        return self.title