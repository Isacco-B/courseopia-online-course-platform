import { useNavigate } from "react-router-dom";
import PageNotFound from "../assets/img/404.svg"
import { Button } from "./ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <img src={PageNotFound} alt="404" />
        <h1 className="text-3xl font-extrabold text-green-600">
          Ops! Pagina non disponibile
        </h1>
        <Button className="uppercase font-semibold" onClick={() => navigate("/dash") }>torna alla home</Button>
      </div>
    </div>
  );
}
