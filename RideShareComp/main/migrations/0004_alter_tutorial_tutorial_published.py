# Generated by Django 3.2.9 on 2021-12-04 04:30

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_delete_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tutorial',
            name='tutorial_published',
            field=models.DateTimeField(default=datetime.datetime(2021, 12, 3, 23, 30, 36, 708669), verbose_name='date published'),
        ),
    ]
