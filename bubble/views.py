from django.shortcuts import render, redirect
import os
import json
from myFileManager.utils import generate_coordinates
from django.http import JsonResponse,HttpResponse, Http404, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from user.models import User
from permission.utils import check_permission
from bubble.models import Terminal_bubble, Leaf_bubble
from permission.models import Terminal_permission,Leaf_permission
from urllib.parse import quote


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

def delete_bubble(request):
    if request.user.is_authenticated:
        user =request.user
    else:
        user = User.objects.get(name="guest")
    bubble_id = request.POST.get('id')
    flag =request.POST.get('flag')

    if flag == "leaf":
        bubble= Leaf_bubble.objects.get(id=bubble_id)
    elif flag =="terminal":
        bubble = Terminal_bubble.objects.get(id=bubble_id)
    else:
        return JsonResponse({'message': "flag error"})

    if check_permission(user,bubble,"d"):
        bubble.delete()
        return JsonResponse({'message':'success'})
    return JsonResponse({'message': 'permision error'})

def post_bubble(request):
    if request.user.is_authenticated:
        user =request.user
    else:
        user = User.objects.get(name="guest")
    bubble_id = request.POST.get('id')
    bubble= Terminal_bubble.objects.get(id=bubble_id)

    if not check_permission(user,bubble,"w"):
        return JsonResponse({'message': 'permision error'})

    flag=request.POST.get('flag')
    if(flag=="terminal"):
        name = request.POST.get('name')
        new_bubble = Terminal_bubble(name=name,parent=bubble)
        new_bubble.save()
        if not user.is_admin:
            permission = Terminal_permission(bubble=new_bubble,read=True,write=True,user=user)
            permission.save()
        guest_bubble= Terminal_bubble.objects.get(id=2)
        guest = User.objects.get(name="guest")
        if user.id != guest.id and (bubble.id == 2 or bubble.check_descendants(bubble)):
            permission =  Terminal_permission(bubble=new_bubble,read=True,write=True,user=guest)
            permission.save()

    elif(flag=="leaf"):
        file = request.FILES.get('file')
        name = request.POST.get('name')
        
        ban_extension= [".exe",".bat",".cmd",".sh",".js",".vbs"]
        
        if not user.is_admin and  os.path.splitext(name)[1].lower() in ban_extension:
            return JsonResponse({'message': 'exp error'})

        new_bubble = Leaf_bubble(name=name,capacity=file.size,file=file)
        path = os.path.join("media/main",name)

        if bubble.check_capacity(new_bubble):
            if bubble.add_bubble(new_bubble):
                new_bubble.save()
                if not user.is_admin:
                    permission = Leaf_permission(bubble=new_bubble,read=True,write=True,user=user)
                    permission.save()

                guest_bubble= Terminal_bubble.objects.get(id=2)
                guest = User.objects.get(name="guest")
                
                if user.id != guest.id and (bubble.id == 2 or bubble.check_descendants(bubble)):
                    permission = Leaf_permission(bubble=new_bubble,read=True,write=True,user=guest)
                    permission.save()
            else:
                return JsonResponse({'message': 'capacity error'})
        else:
            return JsonResponse({'message': 'capacity error'})
    else:
        return JsonResponse({'message': 'flag error'})
    return JsonResponse({'message': 'success',"id":new_bubble.id})

def get_bubble(request):
    if request.user.is_authenticated:
        user =request.user
        print(user.name)
    else:
        user = User.objects.get(name="guest")

    bubble_id = request.GET.get('id')
    bubble= Leaf_bubble.objects.get(id=bubble_id)

    exp = os.path.splitext(bubble.name)[-1] if os.path.splitext(bubble.name)[-1] != "" else os.path.splitext(bubble.name)[0]

    print("Aa",os.path.splitext(bubble.name))

    if not check_permission(user,bubble,"r"):
        if exp ==".jpg" or exp ==".png" or exp ==".PNG":
            return FileResponse(open(r"/home/omyo/project/cookie/myFileManager/media/main/공사다망.png", 'rb'), content_type='image/png')
        elif exp == ".txt" or exp == ".TXT" :
            return JsonResponse({'message': 'permision error'})
        else:
            return JsonResponse({'message': 'permision error'})
    if exp ==".jpg":
        return FileResponse(open(bubble.file.path, 'rb'), content_type='image/jpeg')
    elif exp ==".png" or exp ==".PNG":
        return FileResponse(open(bubble.file.path, 'rb'), content_type='image/png')
    elif exp ==".txt" or exp ==".TXT":
        with open(bubble.file.path, 'r') as file:
            file_content = file.read()
        return HttpResponse(file_content, content_type='text/plain')
    else:
        return JsonResponse({'message': 'exp error'})

def put_bubble(request):
    if request.user.is_authenticated:
        user =request.user
        print(user.name)
    else:
        user = User.objects.get(name="guest")

    bubble_id = request.POST.get('id')
    if request.POST.get('flag') == "terminal":
        bubble= Terminal_bubble.objects.get(id=bubble_id)
    elif request.POST.get('flag') == "leaf":
        bubble= Leaf_bubble.objects.get(id=bubble_id)
    else:
        return JsonResponse({'message': 'flag error'})

    if not check_permission(user,bubble,"w"):
        return JsonResponse({'message': 'permision error'})
    
    if request.POST.get('name') != None:
        bubble.name= request.POST.get('name')



    if request.POST.get('flag') == "leaf":
        exp = os.path.splitext(bubble.name)[-1] if os.path.splitext(bubble.name)[-1] != "" else os.path.splitext(bubble.name)[0]
        if exp==".txt":
            content = request.POST.get('text')
            with open(bubble.file.path, 'w') as file:
                file.write(content)
            bubble.save()
            return JsonResponse({'message': 'success'})
        
    bubble.save()
    return JsonResponse({'message': 'success'})

def patch_bubble(request):
    if request.user.is_authenticated:
        user =request.user
        print(user.name)
    else:
        user = User.objects.get(name="guest")

    bubble_id = request.POST.get('id')
    bubble_id_move = request.POST.get('id_move')

    if request.POST.get('flag') == "terminal":
        bubble_move= Terminal_bubble.objects.get(id=bubble_id_move)
    elif request.POST.get('flag') == "leaf":
        bubble_move= Leaf_bubble.objects.get(id=bubble_id_move)
    else:
        JsonResponse({'message': 'flag error'})

    if not check_permission(user,bubble_move,"r"):
        return JsonResponse({'message': 'permision error'})
    
    bubble = Terminal_bubble.objects.get(id=bubble_id)
    if not check_permission(user,bubble,"w"):
        return JsonResponse({'message': 'permision error'})
    
    bubble.move_bubble(bubble_move)
    bubble_move.save()
    return JsonResponse({'message': 'success'})

def download(request):
    if request.method == 'GET':
        bubble_id=request.GET.get('id')
        bubble = Leaf_bubble.objects.get(id=int(bubble_id))
        if request.user.is_authenticated:
            user =request.user
            print(user.name)
        else:
            user = User.objects.get(name="guest")
        
        if check_permission(user,bubble,"r"):
            with open(bubble.file.path, 'rb') as file:
                file_obj = file.read()

            response = HttpResponse(file_obj, content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{quote(bubble.name)}"'
            return response

        return HttpResponse("권한 오류")

@csrf_exempt
def bubble_view(request):
    if request.method == 'POST':
        if request.POST.get("method") == "POST":
            return post_bubble(request)
        elif request.POST.get("method") == "DELETE":
            return delete_bubble(request)
        elif request.POST.get("method") == "PUT":
            return put_bubble(request) 
        elif request.POST.get("method") == "PATCH":
            return patch_bubble(request)
        else:
            return JsonResponse({'message': 'method error'})
    elif request.method == 'GET':
        return get_bubble(request)
    else:
        JsonResponse({'message': 'method error'})

