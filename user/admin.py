from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import UserChangeForm, UserCreationForm
from .models import User


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ("name", "is_active",'is_admin')
    list_filter = ()
    fieldsets = (
        (None, {'fields': ('name', 'password',"home")}),
        
        ('Permissions', {'fields': ("is_active",'is_admin',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('name', 'password1', 'password2',"is_active","is_admin")}
         ),
    )

    search_fields = ('name',)
    ordering = ('name',)
    filter_horizontal = ()


admin.site.register(User, UserAdmin)
admin.site.unregister(Group)