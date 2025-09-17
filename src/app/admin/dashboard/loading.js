/** @format */

import SectionLoader from '@/components/GeneralSpinner/SectionLoader';
import React from 'react';

const loading = () => {
  return <SectionLoader message="Loading your dashboard..." size={56} />;
};

export default loading;
