from django.urls import path
from .import views

urlpatterns =[
    #user related paths
    path('predict/', views.predict_for_next_100_days, name='predict'),
    path('login/', views.login, name='login'),
    #path('login/', views.login, name='login'),
]