# Generated by Django 3.1.7 on 2021-08-20 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groupapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='logotype',
            field=models.ImageField(blank=True, upload_to='group_avatars'),
        ),
    ]
