import NoImage from "../assets/img/no-image.jpg";
import { BASEURL } from "@/app/api/apiSlice";


export  function useStaticFile(path) {
  const url = path ? BASEURL + "/" +  path : NoImage;
  return url;
}
