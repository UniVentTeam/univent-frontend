
import ProfileCard from '@/pages/Profile/components/ProfileCard';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { userService } from '@/api/userService';
import { useAuthStore } from '@/stores/authStore';

const MyProfile = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await userService.getProfile();
      } catch (error) {
        // Error toast is already handled in the service
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="layout-container py-8">
        <h1 className="text-h1 mb-8">{t('profile.page_title')}</h1>
        <div className="card animate-pulse">
          <div className="h-8 bg-bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-bg-muted rounded w-1/2 mt-2"></div>
          <div className="mt-6 border-t border-border pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-bg-muted rounded w-1/4"></div>
              <div className="h-6 bg-bg-muted rounded w-1/2"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-bg-muted rounded w-1/4"></div>
              <div className="h-6 bg-bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container py-8 pb-32">
      <h1 className="text-h1 mb-8">{t('profile.page_title')}</h1>
      {user && <ProfileCard />}
    </div>
  );
};

export default MyProfile;