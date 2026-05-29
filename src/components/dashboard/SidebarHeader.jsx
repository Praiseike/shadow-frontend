const SidebarHeader = () => {
  return (
    <div className="p-5 border-b border-slate-200/80 flex items-center gap-2">
      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span className="text-xl font-bold text-slate-900 tracking-tight">
        PostNexus
      </span>
    </div>
  );
};

export default SidebarHeader;