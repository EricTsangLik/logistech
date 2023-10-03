import React from 'react'

const tableBody = (array: any) => {
    const headings = Object.keys(array[0]);
    return array.map((row: any, index: number) => {
      return <tr key= {index}>
        {headings.map((key: any, index: any) => {
            return <td key={row[key]}>{row[key]}</td>
        })}
      </tr>;
    });
  };

export default tableBody
