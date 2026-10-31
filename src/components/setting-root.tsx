export const SettingsRoot = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-2 flex text-sm flex-col gap-3 my-2">{children}</div>;
};
export const SettingTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-xs opacity-50">{children}</div>;
};
export const SettingContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

export const SubSetting = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2 my-5">{children}</div>;
};

export const Setting = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

export const SettingWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex  items-baseline space-x-2">{children}</div>;
};

export const SettingLabel = ({ children }: { children: React.ReactNode }) => {
  return <div className="">{children}</div>;
};

export const SettingIcon = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-3 h-3 opacity-30  ">{children}</div>;
};
