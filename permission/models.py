from django.db import models
from user.models import User
from bubble.models import Leaf_bubble,Terminal_bubble

class Permission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    write = models.BooleanField(default=False)
    read = models.BooleanField(default=False)
    delete = models.BooleanField(default=False)
    class Meta:
        abstract = True




class Leaf_permission(Permission):
    bubble = models.ForeignKey(Leaf_bubble, on_delete=models.CASCADE)
    class Meta:
        abstract = False


class Terminal_permission(Permission):
    bubble = models.ForeignKey(Terminal_bubble, on_delete=models.CASCADE)
    class Meta:
        abstract = False

    
