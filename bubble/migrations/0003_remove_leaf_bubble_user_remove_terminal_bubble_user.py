# Generated by Django 4.2.4 on 2023-08-26 17:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bubble', '0002_leaf_bubble_user_terminal_bubble_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='leaf_bubble',
            name='user',
        ),
        migrations.RemoveField(
            model_name='terminal_bubble',
            name='user',
        ),
    ]
