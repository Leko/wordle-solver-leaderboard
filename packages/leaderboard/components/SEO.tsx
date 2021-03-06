import Head from "next/head";

type Props = {
  title: string;
  description?: string;
};

export function SEO(props: Props) {
  const { title, description = "" } = props;

  return (
    <Head>
      <title>{title} | Wordle solver contest</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={`${title} | Wordle solver contest`} />
      <meta name="og:description" content={description} />
      <meta name="twitter:card" content="summary"></meta>
      <meta name="twitter:creator" content="@L_e_k_o" />
    </Head>
  );
}
