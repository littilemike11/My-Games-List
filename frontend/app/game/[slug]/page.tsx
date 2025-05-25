interface Props {
  params: { slug: string };
}

export default function GamePage({ params }: Props) {
  return <h1>Game slug: {params.slug}</h1>;
}
