# Generated by Django 3.1.7 on 2021-10-26 15:42

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('authapp', '0009_auto_20211015_0940'),
    ]

    operations = [
        migrations.AlterField(
            model_name='siteuser',
            name='activation_key_expires',
            field=models.DateTimeField(default=datetime.datetime(2021, 10, 28, 15, 42, 3, 785640, tzinfo=utc), verbose_name='актуальность ключа'),
        ),
    ]
