export const PageLoader = ({ label = 'Chargement...' }: { label?: string }) => (
  <div className="flex min-h-[50vh] items-center justify-center py-16">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      <p className="text-gray-600">{label}</p>
    </div>
  </div>
);
