from django.shortcuts import render, redirect
import os
import json
from myFileManager.utils import generate_coordinates
from django.http import JsonResponse,HttpResponse, Http404, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.views import LoginView

from django.contrib.auth import authenticate, login

def home(request):
    return render(request, 'page.html')

@csrf_exempt
def custom_login(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        password = request.POST.get('password')
        user = authenticate(request, name=name, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'fail'}, status=400)



from user.models import User
from permission.utils import check_permission
from bubble.models import Terminal_bubble, Leaf_bubble
from permission.models import Terminal_permission,Leaf_permission


def get_home(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            user =request.user
            print(user.name)
        else:
            user = User.objects.get(name="guest")
        return JsonResponse({"home":user.home.id})


@csrf_exempt
def get_child(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            user =request.user
            print(user.name)
        else:
            user = User.objects.get(name="guest")
        bubble_id = request.POST.get('bubble_id')
        bubble=Terminal_bubble.objects.get(id=bubble_id)
        if check_permission(user,bubble,"r"):
            child_bubble = list(bubble.terminal_bubble_set.all())+list(bubble.leaf_bubble_set.all())
            points_list = generate_coordinates(len(child_bubble))
            bubble_list=[]
            for i in range(len(child_bubble)):
                bubble_list.append({
                    "name":child_bubble[i].name,
                    "id": child_bubble[i].id,
                    "points":points_list[i],
                    "isTerminal": child_bubble[i].get_type() == "terminal_bubble"
                })
            context={
                "result":True,
                'bubble_list':bubble_list
            }
        else:
            context={
                "result":False
            }
        return JsonResponse(context)

@csrf_exempt
def get_parent(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            user =request.user
            print(user.name)
        else:
            user = User.objects.get(name="guest")
        bubble_id = request.POST.get('bubble_id')
        bubble=Terminal_bubble.objects.get(id=bubble_id)
        bubble= bubble.parent
        if check_permission(user,bubble,"r"):
            context={
                "result":True,
                'bubble_id':bubble.id
            }
        else:
            context={
                "result":False
            }
        return JsonResponse(context)