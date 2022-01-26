type Props = {
  title: string;
  description: string;
};

export function SEO(props: Props) {
  const { title, description } = props;

  return (
    <>
      <title>{title} | Wordle solver contest</title>
      <meta name="og:title" content={description} />
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />
    </>
  );
}
