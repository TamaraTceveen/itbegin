from django.contrib.auth.models import AbstractUser
from django.db import models


class SiteUser(AbstractUser):
    avatar = models.ImageField(verbose_name="аватар пользователя", upload_to="user_avatars", blank=True)
    surname = models.CharField(verbose_name="фамилия", max_length=150, blank=True)
    date_born = models.DateField(verbose_name="день рождения", null=True)
    profession = models.ManyToManyField(verbose_name="профессии", to='Professions', blank=True)
    about_me = models.CharField(verbose_name="обо мне", max_length=1000, blank=True)
    link_to_portfolio = models.CharField(max_length=150, blank=True)
    # my_groups = models.ManyToManyField(to='Groups', blank=True)
    # my_projects = models.ManyToManyField(to='Projects', blank=True)
    free = models.BooleanField(default=True)
    date_last_login = models.DateTimeField(null=True)
    date_update_profile = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'пользователь'
        verbose_name_plural = 'пользователи'


class ContactUser(models.Model):
    user = models.OneToOneField(SiteUser, unique=True, null=False, db_index=True, on_delete=models.CASCADE)
    user_phone = models.CharField(verbose_name="телефон", max_length=20)
    user_email = models.EmailField(verbose_name="email", blank=True)
    user_instagram = models.URLField(verbose_name="инстаграмм", blank=True)
    user_vk = models.URLField(verbose_name="вконтакте", blank=True)
    user_telegram = models.URLField(verbose_name="телеграмм", blank=True)

    class Meta:
        verbose_name = 'контакты'
        verbose_name_plural = 'контакты'


class Professions(models.Model):
    user = models.ManyToManyField(to=SiteUser)
    front_end = models.BooleanField(verbose_name="front-end разработчик", default=False)
    back_end = models.BooleanField(verbose_name="back-end разработчик", default=False)
    web_designer = models.BooleanField(verbose_name="web дизайнер", default=False)
    ux_designer = models.BooleanField(verbose_name="UX дизайнер", default=False)
    game_designer = models.BooleanField(verbose_name="game дизайнер", default=False)
    android = models.BooleanField(verbose_name="android разработчик", default=False)
    ios = models.BooleanField(verbose_name="ios разработчик", default=False)

    class Meta:
        verbose_name = 'профессии'
        verbose_name_plural = 'профессии'
