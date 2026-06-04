import Image from 'next/image';

type Size = 'nav' | 'phone';

export function Wordmark({ size = 'nav', href }: { size?: Size; href?: string }) {
  const markSize = size === 'nav' ? 30 : 15;
  const content = (
    <>
      <Image
        className="brand-mark"
        src="/brand/mark-color.svg"
        alt=""
        width={markSize}
        height={markSize}
        priority={size === 'nav'}
      />
      {size === 'nav' ? (
        <span className="wm">
          <span className="pedi">Pedi</span>
          <span className="check">Check</span>
        </span>
      ) : (
        <>
          <span className="pedi">Pedi</span>
          <span className="check">Check</span>
        </>
      )}
    </>
  );

  if (size === 'phone') {
    return <span className="brand">{content}</span>;
  }

  return (
    <a href={href ?? '#'} className="logo">
      {content}
    </a>
  );
}
