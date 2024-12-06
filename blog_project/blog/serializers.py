from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()  # This will return the username as a string

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author']  # Include 'author' field
