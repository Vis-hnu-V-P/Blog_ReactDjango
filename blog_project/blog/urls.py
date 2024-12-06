from django.urls import path
from django import views
from blog.views import register_view,PostListCreateView, get_logged_in_user,PostRetrieveUpdateDestroyView, login_view,LoginView, logout_view, post_list,PostList, post_create, post_update, post_delete,Register_view
from blog.views import update_post ,delete_post

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('', post_list, name='post_list'),
    path('posts/new/', post_create, name='post_create'),
    path('post/<int:pk>/edit/', post_update, name='post_update'),
    path('post/<int:pk>/delete/', post_delete, name='post_delete'),
    path('api/posts/', PostList.as_view(), name='Post_list'),
    path('api/posts/create/', post_create, name='post_create'),
    path('api/posts/<int:pk>/update/', update_post, name='update_post'),
    # path('api/posts/<int:pk>/update/', post_update, name='update_post'),
    path('api/posts/<int:pk>/delete/', delete_post, name='delete_post'),
    path('api/register/', Register_view, name='Register'),
    path('api/login/', LoginView    , name='login'),
   path('api/posts/', PostListCreateView.as_view(), name='posts'),
    path('api/posts/<int:pk>/', PostRetrieveUpdateDestroyView.as_view(), name='post-detail'),
    path('api/user/', get_logged_in_user, name='get_logged_in_user'),
]
