import math
def generate_coordinates(count):
    coordinates = []
    if count == 1:
        coordinates.append((0.5, 0.5))
    elif count == 2:
        coordinates.append((0.33, 0.5))
        coordinates.append((0.5, 0.66))
    else:
        for i in range(count):
            angle = 2 * math.pi * i / count
            x = round(0.5 + 0.2 * math.cos(angle),2)
            y = round(0.5 + 0.2 * math.sin(angle),2)
            coordinates.append((x, y))
    return coordinates