import { useTranslation } from 'react-i18next';

export function DashboardIndexPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">{t('app.dashboard.title')}</h2>
      </div>
    </div>
  );
}
