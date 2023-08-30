from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.db import models

from django.db import models
from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser)
from bubble.models import Terminal_bubble


class UserManager(BaseUserManager):
    def create_user(self, name, password=None):
        if not name:
            raise ValueError('Users must have an email address')

        user = self.model(
            name=name
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, password):
        user = self.create_user(
            name,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):

    name =  models.CharField(max_length=255,unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    home = models.ForeignKey(Terminal_bubble, on_delete=models.SET_DEFAULT,default=None,null=True)
    objects = UserManager()

    USERNAME_FIELD = 'name'

    def __str__(self):
        return self.name

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin