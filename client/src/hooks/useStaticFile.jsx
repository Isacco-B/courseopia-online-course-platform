// eslint-disable-next-line no-unused-vars
import NoImage from "../assets/img/no-image.jpg";
export  function useStaticFile(path) {
  const BASE_URL = "http://localhost:3000/";
  const url = path ? BASE_URL + path : NoImage;
  return url;
}
