import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <p>dashboard navbar</p>
      {children}
      <p>dashboard navbar</p>
    </div>
  );
};

export default layout;
