import React from 'react';

// Generic shimmer skeleton block — pass a height/width/radius or use one of
// the preset shapes. Used for perceived-performance loading states.
export function Skeleton({ width = '100%', height = '16px', radius = '8px', style = {} }) {
  return <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />;
}

export function SkeletonSkillCard() {
  return (
    <div className="col-card skeleton-card">
      <Skeleton height="34px" width="34px" radius="10px" style={{ marginBottom: '14px' }} />
      <Skeleton height="14px" width="70%" style={{ marginBottom: '10px' }} />
      <Skeleton height="11px" width="45%" style={{ marginBottom: '18px' }} />
      <Skeleton height="10px" width="100%" style={{ marginBottom: '8px' }} />
      <Skeleton height="10px" width="90%" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="invoice-row">
      <Skeleton height="13px" width="60%" />
      <Skeleton height="13px" width="40%" />
      <Skeleton height="13px" width="50%" />
      <Skeleton height="13px" width="30%" />
    </div>
  );
}
