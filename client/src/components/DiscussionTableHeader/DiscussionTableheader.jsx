import './DiscussionTableHeader.css';

const DiscussionTableHeader = () => {
  const headers = [
    { name: 'Topics', colSpan: 2, className: 'text-start' },
    { name: 'Replies', colSpan: 1 },
    { name: 'Views', colSpan: 1 },
    { name: 'Activity', colSpan: 1 },
    { name: 'Votes', colSpan: 1 }
  ];

  return (
    <thead className='thread-list-header'>
      <tr>
        {headers.map((header, index) => (
          <th
            key={index}
            className={`discussion-table-header ${header.className || ''}`}
            colSpan={header.colSpan}
            scope='col'
          >
            {header.name}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default DiscussionTableHeader;