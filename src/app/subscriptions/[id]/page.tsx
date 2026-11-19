import SubscriptionDetailsPage from "./SubscriptionDetailsClient";

export function generateStaticParams() {
  return [
    { id: "sub-netflix" },
    { id: "sub-spotify" },
    { id: "sub-google-one" },
    { id: "sub-dropbox" },
    { id: "sub-adobe" },
    { id: "sub-msft" },
    { id: "sub-gym" },
    { id: "sub-domain" },
    { id: "sub-cloud" },
    { id: "sub-vpn" },
    { id: "sub-news" },
    { id: "sub-music" },
    { id: "sample" },
  ];
}

export default function Page() {
  return <SubscriptionDetailsPage />;
}
