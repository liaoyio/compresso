import { Spacer } from "./spacer";

export const UploaderContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen saturate-0">
      <Spacer />
      <div className="">{children}</div>
      <Spacer />
    </div>
  );
};
