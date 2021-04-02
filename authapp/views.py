from django.contrib import auth
from django.shortcuts import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from authapp.forms import SiteUserLoginForm


def login(request):
    title = "вход"

    login_form = SiteUserLoginForm(data=request.POST or None)
    next_page = request.GET["next"] if "next" in request.GET.keys() else ""

    if request.method == "POST" and login_form.is_valid():
        username = request.POST["username"]
        password = request.POST["password"]

        user = auth.authenticate(username=username, password=password)
        if user and user.is_active:
            auth.login(request, user)
            if "next_page" in request.POST.keys():
                return HttpResponseRedirect(request.POST["next_page"])
            return HttpResponseRedirect(reverse("main"))

    content = {"title": title, "login_form": login_form, "next_page": next_page}
    return render(request, "authapp/login.html", content)
