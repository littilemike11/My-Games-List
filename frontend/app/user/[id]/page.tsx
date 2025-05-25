interface Props {
  params: { id: string };
}

export default function User({ params }: Props) {
  return <h1>User id: {params.id}</h1>;
}
