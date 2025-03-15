declare module 'next/link' {
  import { LinkHTMLAttributes } from 'react';
  
  export interface LinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
  }
  
  const Link: React.FC<LinkProps>;
  export default Link;
}
