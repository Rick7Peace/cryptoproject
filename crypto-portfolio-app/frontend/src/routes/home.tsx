import type { Route } from "./+types/home";
import { Welcome } from "../components/Welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cryptocurrency Portfolio Management" },
    { name: "description", content: "Manage your cryptocurrency portfolio effectively!" },
  ];
}

export default function Home() {
  return <Welcome />;
}