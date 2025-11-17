"""
Settings management endpoints.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.settings import (
    SettingsResponse,
    SettingsUpdate,
    SettingsResetRequest,
)
from app.services.settings_service import SettingsService
from app.core.dependencies import require_permissions


router = APIRouter()


def get_settings_service() -> SettingsService:
    """Dependency to get settings service instance."""
    return SettingsService()


@router.get("", response_model=SettingsResponse, summary="Get user settings")
async def get_settings(
    settings_service: SettingsService = Depends(get_settings_service),
    current_user: dict = Depends(require_permissions(["settings.manage"]))
):
    """
    Get settings for the current authenticated user.
    Creates default settings if none exist.

    Returns:
        SettingsResponse object with all user preferences
    """
    try:
        settings = await settings_service.get_user_settings(None)
        return settings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch settings: {str(e)}"
        )


@router.put("", response_model=SettingsResponse, summary="Update user settings")
async def update_settings(
    settings_update: SettingsUpdate,
    settings_service: SettingsService = Depends(get_settings_service),
    current_user: dict = Depends(require_permissions(["settings.manage"]))
):
    """
    Update settings for the current authenticated user.
    Performs partial updates - only updates provided fields.

    Args:
        settings_update: SettingsUpdate object with fields to update

    Returns:
        Updated SettingsResponse object
    """
    try:
        updated_settings = await settings_service.update_settings(
            None,
            settings_update
        )
        return updated_settings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update settings: {str(e)}"
        )


@router.post("/reset", response_model=SettingsResponse, summary="Reset settings to defaults")
async def reset_settings(
    reset_request: SettingsResetRequest,
    settings_service: SettingsService = Depends(get_settings_service),
    current_user: dict = Depends(require_permissions(["settings.manage"]))
):
    """
    Reset user settings to default values.
    Can reset all settings or specific section.

    Args:
        reset_request: SettingsResetRequest with section to reset
            - section: 'all', 'general', 'appearance', 'notifications', or 'security'

    Returns:
        Updated SettingsResponse object with reset values
    """
    try:
        reset_settings = await settings_service.reset_settings(
            None,
            reset_request.section
        )
        return reset_settings
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reset settings: {str(e)}"
        )


@router.delete("", status_code=status.HTTP_204_NO_CONTENT, summary="Delete user settings")
async def delete_settings(
    settings_service: SettingsService = Depends(get_settings_service),
    current_user: dict = Depends(require_permissions(["settings.manage"]))
):
    """
    Delete user settings (cleanup on user deletion).
    This is primarily for administrative cleanup.

    Returns:
        204 No Content on success
    """
    try:
        await settings_service.delete_user_settings(None)
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete settings: {str(e)}"
        )
