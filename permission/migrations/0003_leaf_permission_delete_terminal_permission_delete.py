# Generated by Django 4.2.4 on 2023-08-29 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('permission', '0002_terminal_permission_read_terminal_permission_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='leaf_permission',
            name='delete',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='terminal_permission',
            name='delete',
            field=models.BooleanField(default=False),
        ),
    ]
