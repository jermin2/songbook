from django.shortcuts import render
from .serializers import SongSerializer, BookSerializer
from rest_framework import viewsets
from .models import Song, Book
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

class BookView(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookSerializer
    queryset = Book.objects.all()

# this decorator is essential
@api_view(['GET', 'DELETE'])
def test_token(request):

    if request.user.is_authenticated:
        print("I am logged in")
    else:
        print("i am not")
    return JsonResponse({
        "method":request.method,
        "user":str(request.user)
    },
    status=200)

# @authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])
@api_view(['GET', 'PUT'])
def edit_song(request, id):
    # if request.method == "PUT":
    print(request.user)    

    if request.user.is_anonymous:
        return JsonResponse({
            "data":request.method,
            "d": id
            }, status=200)
    

    return JsonResponse({
        "data": "something yes",
        "user": str(request.user)
    },status=200)    
    
    

    return JsonResponse({
        "data":"some data i don't know"
    },
    status=401)