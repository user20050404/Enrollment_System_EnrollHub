from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate
from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
import logging

from .serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer

logger = logging.getLogger(__name__)
User = get_user_model()

# =========================
# SEND EMAIL (WITH BETTER ERROR LOGGING)
# =========================
def send_verification_email(user):
    try:
        token = str(user.verification_token)
        verify_url = f"{settings.FRONTEND_URL}/verify-email/{token}"
        
        subject = "Verify your EnrollHub account"
        message = f"""Hi {user.first_name},

Welcome to EnrollHub! Please verify your email address by clicking the link below:

{verify_url}

If you didn't create this account, please ignore this email.

Best regards,
EnrollHub Team"""

        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        email.send(fail_silently=False)
        logger.info(f"Verification email sent to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
        print("EMAIL ERROR:", str(e))
        return False


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

        # Try to send email, but don't fail registration if it fails
        email_sent = send_verification_email(user)

        response_message = "Registered successfully."
        if not email_sent:
            response_message += " However, verification email could not be sent. Please contact support."

        return Response({
            "message": response_message,
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


# =========================
# VERIFY EMAIL
# =========================
class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        try:
            user = User.objects.get(verification_token=token)

            if user.is_verified:
                return Response({"message": "Already verified."})

            user.is_verified = True
            user.verification_token = None
            user.save()

            return Response({"message": "Email verified successfully."})

        except User.DoesNotExist:
            return Response(
                {"error": "Invalid or expired verification link."},
                status=400
            )


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
            return Response({'error': 'Email not verified. Please check your inbox.'}, status=403)

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
        })


# =========================
# PROFILE VIEW (GET & PUT)
# =========================
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully.",
                "user": serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# CHANGE PASSWORD
# =========================
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            if not request.user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": "Old password is incorrect."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            
            return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# USER LIST
# =========================
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]