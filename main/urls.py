from . import views
from django.urls import path, include

urlpatterns = [
    path('', views.home,name="home"),
    path('get_child', views.get_child,name="get_child"),
    path('get_home', views.get_home,name="get_home"),
    path('get_parent', views.get_parent,name="get_parent"),
]

from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)