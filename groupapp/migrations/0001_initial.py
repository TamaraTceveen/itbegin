# Generated by Django 3.1.7 on 2021-05-28 14:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('mainapp', '0001_initial'),
        ('authapp', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DescriptionNeedProfessions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('description', models.CharField(blank=True, max_length=200)),
                ('logotype', models.ImageField(blank=True, upload_to='')),
                ('date_create', models.DateTimeField(auto_now_add=True)),
                ('date_update', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='author_group', to=settings.AUTH_USER_MODEL)),
                ('done_task', models.ManyToManyField(blank=True, related_name='done_task', to='mainapp.Task')),
                ('got_task', models.ManyToManyField(null=True, related_name='got_task', to='mainapp.Task')),
                ('need_profession', models.ManyToManyField(through='groupapp.DescriptionNeedProfessions', to='authapp.Professions')),
                ('team_members', models.ManyToManyField(null=True, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'команда',
                'verbose_name_plural': 'команды',
            },
        ),
        migrations.AddField(
            model_name='descriptionneedprofessions',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groupapp.group'),
        ),
        migrations.AddField(
            model_name='descriptionneedprofessions',
            name='profession',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authapp.professions'),
        ),
    ]
