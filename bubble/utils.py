from bubble.models import leaf_bubble,terminal_bubble


def pathToBubble(path):
    for name in path.split("/"):
        bubble=Bubble.objects.get(name=name)
        
        terminal_bubble_set.get(name="b")
