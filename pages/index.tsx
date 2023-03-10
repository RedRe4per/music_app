import Head from "next/head";
import { AlbumList } from "@/components/AlbumList";
import { IAlbumList } from "@/interfaces/album";

interface Props {
  [key: string]: IAlbumList;
}

export default function Home({
  albumAreaEA,
  albumAreaJP,
  albumAreaKR,
  albumAreaZH,
}: Props) {
  return (
    <section>
      <Head>
        <title>MusicTube</title>
        <meta name="description" content="Built by Derek" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="overflow-auto scrollbar">
        <AlbumList
          title={"European & American Latest Album"}
          albumList={albumAreaEA}
        />
        <AlbumList title={"Japanese Latest Album"} albumList={albumAreaJP} />
        <AlbumList title={"Korean Latest Album"} albumList={albumAreaKR} />
        <AlbumList title={"Chinese Latest Album"} albumList={albumAreaZH} />
      </main>
    </section>
  );
}

export async function getStaticProps() {
  const EAResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/album/list/style?area=E_A`
  );
  const albumAreaEA = await EAResponse.json();
  const JPResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/album/list/style?area=JP`
  );
  const albumAreaJP = await JPResponse.json();
  const KRResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/album/list/style?area=KR`
  );
  const albumAreaKR = await KRResponse.json();
  const ZHResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/album/list/style?area=Z_H`
  );
  const albumAreaZH = await ZHResponse.json();

  return {
    props: { albumAreaEA, albumAreaJP, albumAreaKR, albumAreaZH },
    revalidate: 86400,
  };
}
