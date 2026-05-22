import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from cloudinary.models import CloudinaryField


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    
    email = models.EmailField(unique=True)
    
    role = models.CharField(
        max_length=20,
        choices=[
            ('admin', 'Admin'),
            ('staff', 'Staff'),
            ('student', 'Student'),
        ],
        default='student'
    )
    
    verification_token = models.UUIDField(default=uuid.uuid4, editable=False, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    
    profile_picture = CloudinaryField('image', null=True, blank=True)
    
    def get_short_name(self):
        return self.first_name or self.email.split('@')[0]
    
    def get_full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.email
    
    @property
    def full_name(self):
        return self.get_full_name()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = UserManager()
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"