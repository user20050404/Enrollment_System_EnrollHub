from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_verified', 'is_active']
    list_filter = ['role', 'is_verified', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    readonly_fields = ['date_joined', 'verification_token', 'id']

    fieldsets = (
        ('Account', {'fields': ('id', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'profile_picture')}),
        ('Permissions', {'fields': ('role', 'is_verified', 'is_active', 'is_staff', 'is_superuser')}),
        ('Dates', {'fields': ('date_joined', 'verification_token')}),
    )