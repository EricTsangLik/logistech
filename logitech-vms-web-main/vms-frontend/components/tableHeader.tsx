import React from 'react'

const tableHeader = (array: any) => {
  const headers = Object.keys(array[0] ?? {});
  return headers.map((x) => {
    return (
      <th key={x}>
        {x}
      </th>
    );
  });
};

export default tableHeader