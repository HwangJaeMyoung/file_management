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

@csrf_exempt
def get_listdir(request):
    if request.method == 'POST':
        path = request.POST.get('path')
        isdir=os.path.isdir(path)
        button_list = os.listdir(path)
        points_list = generate_coordinates(len(button_list))
        bubble_list=[]
        for i in range(len(button_list)):
            bubble_list.append({
                "name":button_list[i],
                "points":points_list[i],
                "isdir":os.path.isdir(os.path.join(path,button_list[i]))
            })
        context={
            'bubble_list':bubble_list
        }
    return JsonResponse(context)

@csrf_exempt
def delete(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            user =request.user
            print(user.name)
        else:
            user = User.objects.get(name="guest")
        bubble_id = request.POST.get('id')
        bubble= Leaf_bubble.objects.get(id=bubble_id)
        if check_permission(user,bubble,"d"):
            bubble.delete()
            return JsonResponse({'message': '삭제되었습니다.'})
        return JsonResponse({'message': '잘못된 요청입니다.'})


@csrf_exempt
def upload(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            user =request.user
            print(user.name)
        else:
            user = User.objects.get(name="guest")
        bubble_id = request.POST.get('id')
        bubble= Terminal_bubble.objects.get(id=bubble_id)
        if not check_permission(user,bubble,"w"):
            return JsonResponse({'message': '잘못된 요청입니다.'})
        flag=request.POST.get('flag')
        if(flag=="terminal"):
            name = request.POST.get('name')
            new_bubble = Terminal_bubble(name=name,parent=bubble)
            new_bubble.save()
            if not user.is_admin:
                permission = Terminal_permission(bubble=new_bubble,read=True,write=True,user=user)
                permission.save()
        elif(flag=="leaf"):
            file = request.FILES.get('file')
            name = request.POST.get('name')
            new_bubble = Leaf_bubble(name=name,capacity=file.size,file=file)
            path = os.path.join("media/main",name)
            if bubble.check_capacity(new_bubble):
                if bubble.add_bubble(new_bubble):
                    new_bubble.save()
                    if not user.is_admin:
                        permission = Leaf_permission(bubble=new_bubble,read=True,write=True,user=user)
                        permission.save()
            else:
                return JsonResponse({'message': '잘못된 요청입니다.'})
        else:
            return JsonResponse({'message': '잘못된 요청입니다.'})
        return JsonResponse({'message': '파일 업로드가 성공적으로 완료되었습니다.',"id":new_bubble.id})
    return JsonResponse({'message': '잘못된 요청입니다.'})
    

from urllib.parse import quote
@csrf_exempt
def download(request):
    if request.method == 'GET':
        bubble_id=request.GET.get('bubble_id')
        bubble = Leaf_bubble.objects.get(id=int(bubble_id))
        if request.user.is_authenticated:
            user =request.user
            print(user.name)
        else:
            user = User.objects.get(name="guest")
        
        if check_permission(user,bubble,"r"):
            with open(bubble.file.path, 'rb') as file:
                file_obj = file.read()

            print(bubble.name)
            response = HttpResponse(file_obj, content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{quote(bubble.name)}"'

            return response

        return HttpResponse("권한 오류")

