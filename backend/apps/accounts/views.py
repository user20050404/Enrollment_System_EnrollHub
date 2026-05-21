from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.core.mail import send_mail
from django.conf import settings

from .serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer

User = get_user_model()


# =========================
# EMAIL SENDER (FIXED)
# =========================
def send_verification_email(user):
    try:
        token = str(user.verification_token)

        # ✅ IMPORTANT FIX: use BACKEND endpoint, not frontend
        verify_url = f"{settings.BACKEND_URL}/api/auth/verify/{token}/"

        send_mail(
            subject="Verify your enrollment account",
            message=(
                f"Hi {user.first_name},\n\n"
                f"Click the link below to verify your account:\n\n"
                f"{verify_url}\n\n"
                f"If you did not register, ignore this email."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

    except Exception as e:
        print("EMAIL ERROR:", str(e))


# =========================
# REGISTER
# =========================
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        send_verification_email(user)

        return Response({
            "message": "Registration successful. Check your email to verify your account.",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


# =========================
# VERIFY EMAIL (FIXED)
# =========================
class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        try:
            user = User.objects.get(verification_token=token)

            if user.is_verified:
                return Response({"message": "Email already verified."})

            user.is_verified = True

            # 🔥 IMPORTANT FIX: invalidate token after use
            user.verification_token = None
            user.save()

            return Response({"message": "Email verified successfully."})

        except User.DoesNotExist:
            return Response({"error": "Invalid or expired verification link."}, status=400)


# =========================
# LOGIN
# =========================
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password required.'}, status=400)

        user = authenticate(request, email=email, password=password)

        if not user:
            return Response({'error': 'Invalid credentials.'}, status=401)

        if not user.is_verified:
            return Response({'error': 'Email not verified.'}, status=403)

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
        })


# =========================
# PROFILE
# =========================
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


# =========================
# CHANGE PASSWORD
# =========================
class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'error': 'Old password incorrect.'}, status=400)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({'message': 'Password changed successfully.'})


# =========================
# ADMIN USER LIST
# =========================
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all().order_by('-date_joined')