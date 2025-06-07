from rest_framework import permissions
from rest_framework.authtoken.models import Token

class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_obj_permission(request, obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        return obj == request.user
