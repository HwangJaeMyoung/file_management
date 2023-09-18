from django.db import models
# from user.models import User

class Bubble(models.Model):
    name = models.CharField(max_length=255)
    capacity = models.FloatField(default=0)
    # user = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=1)
    parent = models.ForeignKey("terminal_bubble", on_delete=models.CASCADE, null=True)
    class Meta:
        abstract = True
    
    def get_ancestor(self):
        bubble = self.parent
        bubble_list=[]
        while(bubble != None):
            bubble_list.append(bubble)
            bubble=bubble.parent
        return bubble_list[::-1]

    def sub_capacity(self,bubble):
        if self.capacity <= bubble.capacity:
            self.capacity = 0
        else:
            self.capacity -= bubble.capacity

    def get_type(self):
        return "bubble"
    
    def delete(self):
        for ancestor in self.get_ancestor():
            ancestor.sub_capacity(self)
            ancestor.save()
        super().delete()

class Terminal_bubble(Bubble):
    allowable_capacity = models.FloatField(default=0)
    class Meta:
        abstract = False

    # b1에 b2가 자식인지 확인
    def check_child(self,bubble):
        if(self == bubble.parent): 
            return True
        else:
            return False

    # b1에 b2가 자손인지 확인
    def check_descendants(self,bubble):
        if bubble.parent == None:
            return False
        if self.check_child(bubble):
            return True
        else:
            return self.check_descendants(bubble.parent)
    
    def check_capacity(self,bubble):
        return self.allowable_capacity >= self.capacity + bubble.capacity
    def add_bubble(self,bubble):
        if self.check_capacity(bubble):
            bubble.parent=self
            self.capacity  += bubble.capacity
            for ancestor in self.get_ancestor():
                ancestor.capacity+= bubble.capacity
                ancestor.save()
            self.save()
            return True
        else:
            return False

    def move_bubble(self,bubble):
        if isinstance(bubble,Terminal_bubble):
            assert not bubble.check_descendants(self),"루프에러" 

        if self.check_descendants(bubble):
            selected_bubble= bubble.parent
            while(self != selected_bubble):
                selected_bubble.capacity -= bubble.capacity
                selected_bubble = selected_bubble.parent
            bubble.parent=self

        else:
            assert self.check_capacity(bubble)
            self_ancestor=self.get_ancestor()
            bubble_ancestor=bubble.get_ancestor()
            
            n = min(len(self_ancestor),len(bubble_ancestor))
            for i in range(n):
                print(i)
                if self_ancestor[i] != bubble_ancestor[i]:
                    i-1
                    break
            selected_ancestor = bubble_ancestor[i]

            selected_bubble= bubble.parent
            while(selected_ancestor != selected_bubble):
                selected_bubble.capacity -= bubble.capacity
                selected_bubble = selected_bubble.parent
            
            selected_bubble= self
            while(selected_ancestor != selected_bubble):
                selected_bubble.capacity += bubble.capacity
                selected_bubble = selected_bubble.parent

            bubble.parent= self
    def get_type(self):
        return "terminal_bubble"

class Leaf_bubble(Bubble):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='main/')
    class Meta:
        abstract = False
    def get_type(self):
        return "leaf_bubble"