import { Suspense } from "react";

const LayoutAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <div className="w-full h-full">{children}</div>
    </Suspense>
  );
};
export default LayoutAuth;
