from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.http import JsonResponse
from .models import Post, Comment, Like, Follow
from django.contrib.auth.models import User

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # Auto login after registration
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome {username}! Your account has been created.')
                return redirect('home')
        else:
            # Pass form with errors to template
            messages.error(request, 'Please correct the errors below.')
            return render(request, 'register.html', {'form': form})
    else:
        form = UserCreationForm()
    
    return render(request, 'register.html', {'form': form})

@login_required
def home(request):
    # Get posts from users that the current user follows
    following_users = Follow.objects.filter(follower=request.user).values_list('following', flat=True)
    all_posts = Post.objects.all().order_by('-created_at')
    
    return render(request, 'home.html', {
        'posts': all_posts,
        'suggested_users': User.objects.exclude(id=request.user.id).exclude(id__in=following_users)[:5]
    })

@login_required
def create_post(request):
    if request.method == 'POST':
        content = request.POST.get('content')
        if content and content.strip():
            Post.objects.create(user=request.user, content=content.strip())
            messages.success(request, 'Post created successfully!')
        else:
            messages.error(request, 'Post content cannot be empty!')
    return redirect('home')

@login_required
def like_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    like, created = Like.objects.get_or_create(post=post, user=request.user)
    
    if not created:
        like.delete()
        liked = False
    else:
        liked = True
    
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({
            'liked': liked,
            'like_count': post.likes.count()
        })
    
    return redirect('home')

@login_required
def add_comment(request, post_id):
    if request.method == 'POST':
        post = get_object_or_404(Post, id=post_id)
        content = request.POST.get('content')
        if content and content.strip():
            Comment.objects.create(post=post, user=request.user, content=content.strip())
            messages.success(request, 'Comment added!')
    return redirect('home')

@login_required
def follow_user(request, user_id):
    user_to_follow = get_object_or_404(User, id=user_id)
    
    if request.user != user_to_follow:
        follow, created = Follow.objects.get_or_create(
            follower=request.user, 
            following=user_to_follow
        )
        if not created:
            follow.delete()
            followed = False
        else:
            followed = True
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'followed': followed})
    
    return redirect('home')

@login_required
def profile(request, username):
    user_profile = get_object_or_404(User, username=username)
    posts = Post.objects.filter(user=user_profile).order_by('-created_at')
    is_following = Follow.objects.filter(follower=request.user, following=user_profile).exists()
    
    return render(request, 'profile.html', {
        'user_profile': user_profile,
        'posts': posts,
        'is_following': is_following,
        'followers_count': user_profile.followers.count(),
        'following_count': user_profile.following.count()
    })