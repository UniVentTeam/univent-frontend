// src/pages/Profile/EditProfile.tsx
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { components } from '@/types/schema';
import { userService } from '@/api/userService';
import { cn } from '@/utils/cn';

type UserProfile = components['schemas']['UserProfile'];
type EnumEventType = components['schemas']['EnumEventType'];

// Define all possible event types as an array for easy iteration
const ALL_EVENT_TYPES: EnumEventType[] = [
  'ACADEMIC',
  'SOCIAL',
  'SPORTS',
  'CAREER',
  'VOLUNTEERING',
  'WORKSHOP',
];

const EditProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: '',
    faculty: '',
    department: '',
    preferences: [], // Initialize preferences as an empty array
  });
  const [selectedPreferences, setSelectedPreferences] = useState<EnumEventType[]>([]);
  const [errors, setErrors] = useState<{ fullName?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        faculty: user.faculty,
        department: user.department,
        preferences: user.preferences || [],
      });
      setSelectedPreferences(user.preferences || []);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePreferenceChange = (type: EnumEventType) => {
    setSelectedPreferences((prev) =>
      prev.includes(type) ? prev.filter((p) => p !== type) : [...prev, type]
    );
  };

  const validate = () => {
    const newErrors: { fullName?: string } = {};
    if (!formData.fullName?.trim()) {
      newErrors.fullName = t('profile.validation.fullName_required');
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = await userService.updateProfile({
        ...formData,
        preferences: selectedPreferences,
      });
      setUser(updatedUser as UserProfile); // Update local store
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="layout-container py-8 pb-32">
      <h1 className="text-h1 mb-8">{t('profile.edit_page_title')}</h1>

      <form onSubmit={handleSubmit} className="card max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <label htmlFor="fullName" className="label">
              {t('profile.fullName_label')}
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={cn('input-field', errors.fullName && 'border-destructive')}
              value={formData.fullName ?? ''}
              onChange={handleChange}
            />
            {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="faculty" className="label">
              {t('profile.faculty_label')}
            </label>
            <input
              type="text"
              id="faculty"
              name="faculty"
              className="input-field"
              value={formData.faculty ?? ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="department" className="label">
              {t('profile.department_label')}
            </label>
            <input
              type="text"
              id="department"
              name="department"
              className="input-field"
              value={formData.department ?? ''}
              onChange={handleChange}
            />
          </div>

          {/* Preferences Section */}
          <div>
            <label className="label mb-2 block">{t('profile.preferences_title')}</label>
            <div className="grid grid-cols-2 gap-4">
              {ALL_EVENT_TYPES.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`preference-${type}`}
                    name={`preference-${type}`}
                    checked={selectedPreferences.includes(type)}
                    onChange={() => handlePreferenceChange(type)}
                    className="h-4 w-4 text-accent border-border rounded focus:ring-accent"
                  />
                  <label htmlFor={`preference-${type}`} className="ml-2 text-primary">
                    {t(`event_types.${type}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/profile')}
            disabled={isSaving}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className={cn('btn btn-primary', isSaving && 'opacity-50')}
            disabled={isSaving}
          >
            {isSaving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
