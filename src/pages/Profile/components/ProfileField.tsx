// src/pages/Profile/components/ProfileField.tsx
import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface ProfileFieldProps {
  label: string;
  value: string | null | undefined;
  icon?: LucideIcon;
  className?: string;
}

const ProfileField = ({ label, value, icon: Icon, className }: ProfileFieldProps) => {
  return (
    <div className={cn('flex items-center gap-4 p-3 rounded-lg', className)}>
      {Icon && <Icon className="w-6 h-6 text-secondary" />}
      <div className="flex flex-col">
        <span className="text-sm text-secondary">{label}</span>
        <span className="text-primary font-medium">{value ?? 'N/A'}</span>
      </div>
    </div>
  );
};

export default ProfileField;
