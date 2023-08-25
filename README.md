# songbook

A songbook app that displays songs in books. You can search for songs using any word, or using the index of the book. 
Authenticated users can add/edit songs, add/edit books, and print books

## Frontend 
Written in React/JS. 
Hosted on Heroku @ http://jermin-songbook.herokuapp.com/

## Backend
Written in Django/Python
Contains api
Hosted on PythonAnywhere @ https://jermin2.pythonanywhere.com/api

Requires Django and the following modules
- django-cors-headers
- djangorestframework
- djangorestframework-simplejwt

### API Routes:
- song
-- Allows fetching, adding, updating, deleting of songs
- book
-- Allows fetching, adding, updating, deleting of books
- update
-- Gets the length of the song and book tables to determine whether to update the local database
- printer
-- The saved text and style used for printing books

## Program Structure

There are three main modules
### Song
This controls the display of the song, and display of the song list
Included functionality is the hiding of all the chords and increase/decrease of Capo

### Book
Each song can be part of a book. Each song in a book has an index. 
When you select a book, the list of songs in the book appears along with their index.
To edit a book, find the song you want and click it. It will get added to the bottom of the book list. To reorder the book, simply drag and drop. Indexes will update automatically

### Print
Print books allows one to create a songbook without having to fiddle around with margins and chord spacing in Word/Doc. It is a text parser, similar to Latex, that allows you to preview what the song book will look like. There is a css styler, where you can customise the css classes (eg, change margins, font-size, font). These will get saved for next time.

When you are ready to print, you can click the print button which takes you to a page that is ready for printing to PDF. 
