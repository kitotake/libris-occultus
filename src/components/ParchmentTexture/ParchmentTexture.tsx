import './ParchmentTexture.scss';

interface Props {
  variante?: 'parchemin' | 'cuir';
  children: React.ReactNode;
  className?: string;
}

export default function ParchmentTexture({ variante = 'parchemin', children, className = '' }: Props) {
  return (
    <div className={`texture texture--${variante} ${className}`}>
      <div className="texture__vignette" aria-hidden="true" />
      {children}
    </div>
  );
}
