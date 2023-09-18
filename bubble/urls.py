from . import views
from django.urls import path, include

urlpatterns = [
    # path('dir', views.get_listdir,name="listdir"),
    # path('upload', views.upload,name="upload"),
    path('/download', views.download,name="download"),
    # path('get_child', views.get_child,name="get_child"),
    # path('get_home', views.get_home,name="get_home"),
    # path('get_parent', views.get_parent,name="get_parent"),
    # path('image', views.get_image, name='get_image'),
    # path('delete', views.delete, name='delete'),
    # path("text",views.get_text,name="get_text"),
    #  path("save_text",views.save_text,name="save_text"),
    path("",views.bubble_view,name="bubble_view")
]