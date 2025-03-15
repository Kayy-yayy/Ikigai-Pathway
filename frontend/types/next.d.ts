declare module 'next' {
  export type NextPage<P = {}, IP = P> = React.ComponentType<P> & {
    getInitialProps?: (context: any) => Promise<IP>;
  };
  
  export type GetStaticProps = any;
  export type GetServerSideProps = any;
  export type InferGetStaticPropsType<T> = any;
  export type InferGetServerSidePropsType<T> = any;
}
