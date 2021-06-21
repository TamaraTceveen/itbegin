from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.forms import inlineformset_factory
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy, reverse
from django.views.generic import ListView, UpdateView, DeleteView, CreateView, DetailView

from authapp.models import SiteUser
from groupapp.forms import CreateGroupForm, UpdateVacancyForm, CreateApplicationToNeedProfessionForm
from groupapp.models import Group, DescriptionNeedProfessions, ApplicationToNeedProfession


def groups(request, page_num=1):
    title = 'команды'
    groups = Group.objects.filter(is_active=True)

    groups_paginator = Paginator(groups, 3)
    try:
        groups = groups_paginator.page(page_num)
    except PageNotAnInteger:
        groups = groups_paginator.page(1)
    except EmptyPage:
        groups = groups_paginator.page(groups_paginator.num_pages)

    content = {'title': title, 'page_obj': groups}
    return render(request, 'groupapp/groups.html', context=content)


def user_groups(request, page_num=1):
    title = 'команды'
    groups = Group.objects.filter(author=request.user)

    groups_paginator = Paginator(groups, 3)
    try:
        groups = groups_paginator.page(page_num)
    except PageNotAnInteger:
        groups = groups_paginator.page(1)
    except EmptyPage:
        groups = groups_paginator.page(groups_paginator.num_pages)

    content = {'title': title, 'page_obj': groups}
    return render(request, 'groupapp/mygroups.html', context=content)


# class UserGroupView(ListView):
#     model = Group
#     template_name = 'groupapp/mygroups.html'
#     paginate_by = 3
#
#     def get_queryset(self):
#         queryset = Group.objects.filter(author=self.request.user).order_by('date_create')
#         ordering = self.get_ordering()
#         if ordering:
#             if isinstance(ordering, str):
#                 ordering = (ordering,)
#             queryset = queryset.order_by(*ordering)
#         return queryset


# def create_group(request):
#     title = "создание команды"
#
#     if request.method == "POST":
#         create_group_form = CreateGroupForm(request.POST, request.FILES)
#
#         if create_group_form.is_valid():
#             new_group = create_group_form.save(commit=False)
#             new_group.author = request.user
#             new_group.save()
#             new_group.need_profession.add(*create_group_form.data.getlist('need_profession'))
#             return HttpResponseRedirect(reverse('groupapp:groups'))
#     else:
#         create_group_form = CreateGroupForm()
#
#     content = {
#         "title": title,
#         "object_list": create_group_form
#     }
#     return render(request, "groupapp/create_group.html", content)

class GroupCreateView(CreateView):
    model = Group
    form_class = CreateGroupForm
    template_name = 'groupapp/create_group.html'

    # success_url = reverse_lazy('groupapp:groups')

    def post(self, request, *args, **kwargs):
        '''
        added to the method author=user
        '''
        form = self.get_form()
        if form.is_valid():
            new_group = form.save(commit=False)
            new_group.author = request.user
            new_group.save()
            new_group.need_profession.add(*form.data.getlist('need_profession'))
            return self.form_valid(form)
        else:
            return self.form_invalid(form)


def group(request, pk):
    title = 'команда'
    this_group = Group.objects.get(pk=pk)
    team_professions = SiteUser.objects.get(id=request.user.id).profession.all()
    members = SiteUser.objects.filter(group__team_members__group=pk)
    need_professions = DescriptionNeedProfessions.objects.filter(group_id=pk)

    content = {
        'title': title,
        'this_group': this_group,
        'need_professions': need_professions,
        'team_professions': team_professions,
        'members': members
    }
    return render(request, 'groupapp/group.html', context=content)


class GroupUpdateView(UpdateView):
    model = Group
    form_class = CreateGroupForm
    template_name = 'groupapp/create_group.html'
    success_url = reverse_lazy('groupapp:groups')


class GroupDeleteView(DeleteView):
    model = Group
    success_url = reverse_lazy('groupapp:groups')

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        success_url = self.get_success_url()
        self.object.is_active = False
        self.object.save()
        return HttpResponseRedirect(success_url)


class SettingView(ListView):
    """
    page setting group
    """
    model = Group


class VacancyUpdate(UpdateView):
    """
    form description vacancy of group
    """
    model = Group
    fields = []
    success_url = reverse_lazy('groupapp:groups')

    def get_context_data(self, **kwargs):
        data = super(VacancyUpdate, self).get_context_data(**kwargs)
        VacancyFormSet = inlineformset_factory(Group, DescriptionNeedProfessions, form=UpdateVacancyForm, extra=1)
        pk = self.kwargs.get('pk')

        if self.request.POST:
            formset = VacancyFormSet(self.request.POST, instance=Group.objects.get(id=pk))
        else:
            need_profession = DescriptionNeedProfessions.objects.filter(group=pk)
            if len(need_profession):
                VacancyFormSet = inlineformset_factory(Group, DescriptionNeedProfessions, form=UpdateVacancyForm,
                                                       extra=len(need_profession))
                formset = VacancyFormSet()
                for el, form in enumerate(formset.forms):
                    form.initial['profession'] = need_profession[el].profession
                    form.initial['description'] = need_profession[el].description
                    form.initial['group'] = need_profession[el].group
                    form.initial['id'] = need_profession[el].id
        data['vacancyneed'] = formset
        return data

    def form_valid(self, form):
        """need refactor"""
        if form.is_valid:
            my_list = []
            a = []
            for key, el in form.data.items():
                if key[33:] == 'description':
                    a.append(el)
                if key[33:] == 'id':
                    a.append(el)
                    my_list.append(a)
                    a = []
            for el in my_list:
                idx = int(el[1])
                dis = el[0]
                f = DescriptionNeedProfessions.objects.get(id=idx)
                f.description = dis
                f.save()
            form.save()
            return super().form_valid(form)


class NeedProfessionDescriptionView(DetailView):
    model = DescriptionNeedProfessions


def create_application_need_prof(request, pk):
    need_prof_pk = pk

    if request.method == "POST":
        form = CreateApplicationToNeedProfessionForm(request.POST, request.FILES)

        if form.is_valid():
            new_form = form.save(commit=False)
            new_form.to_need_profession = DescriptionNeedProfessions.objects.get(id=pk)
            new_form.author_application = request.user
            new_form.save()
            return HttpResponseRedirect(reverse('mainapp:index'))
    else:
        form = CreateApplicationToNeedProfessionForm()

    content = {
        "need_prof_pk": need_prof_pk,
        "forms": form
    }
    return render(request, "groupapp/applicationtoneedprofession_form.html", content)


# class CreateApplicationNeedProfView(CreateView):
#     model = ApplicationToNeedProfession
#     form_class = CreateApplicationToNeedProfessionForm
#     success_url = reverse_lazy('groupapp:groups')
#
#     def form_valid(self, form):
#         """If the form is valid, save the associated model."""
#         print(self.request)
#         form.instance.author_application = self.request.user.id
#         form.instance.to_need_profession = self.request
#         self.object = form.save()
#         return super().form_valid()

def create_request_in_team(request):
    pass
