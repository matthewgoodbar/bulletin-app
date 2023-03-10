from django.db import models

# Create your models here.
class Post(models.Model):
    author = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=40)
    body = models.TextField(max_length=400)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Reply(models.Model):
    author = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='replies')
    replying_to = models.ForeignKey(Post, on_delete=models.CASCADE)
    body = models.TextField(max_length=400)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
