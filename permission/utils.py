from django.core.exceptions import ObjectDoesNotExist
from .models import Leaf_permission,Terminal_permission
from user.models import User
from bubble.models import Leaf_bubble,Terminal_bubble

def check_permission(user,bubble,mode):
    if not isinstance(user,User):
        print("type 오류")
        return False
    if user.is_admin:
        return True
    if isinstance(bubble,Terminal_bubble):
        Permission= Terminal_permission
    elif isinstance(bubble,Leaf_bubble):
        Permission= Leaf_permission
    else:
        print("type 오류")
        return False
    try:
        permission = Permission.objects.get(user=user,bubble=bubble)
        if mode=="r":
            return permission.read
        elif mode=="w":
            return permission.write
        elif mode=="d":
            return permission.write
        else:
            print("mode 오류")
            return False
    except ObjectDoesNotExist:
        return False