import React, { createContext, useContext, useState } from 'react';

const defaultFlags = {
  showNewBanner: false,
  enableBetaFeature: false,
};

const FeatureFlagsContext = createContext(defaultFlags);

export const FeatureFlagsProvider = ({ children }) => {
  const [flags, setFlags] = useState(defaultFlags);

  const toggleFlag = (flag) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, toggleFlag }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => useContext(FeatureFlagsContext);
