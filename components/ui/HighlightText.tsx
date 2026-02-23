export function HighlightText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  // Create a regular expression to find the highlight (case-insensitive)
  const regex = new RegExp(`(${highlight})`, 'gi');

  // Split text by the regex
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        // Check if this part matches the highlight
        regex.test(part) ? (
          <span
            key={i}
            className='font-extrabold text-blue-600 bg-blue-50 rounded px-0.5'
          >
            {part}
          </span>
        ) : (
          <span key={i} className='text-gray-600'>
            {part}
          </span>
        ),
      )}
    </span>
  );
}
