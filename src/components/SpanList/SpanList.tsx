import { Link } from "react-router-dom";
import { Artist } from "../../types/Artist";
import { paths } from "../../utils/paths";

interface SpanListProps {
  data: Artist[];
  linkClassName: string;
  spanClassName: string;
}

export function SpanList({
  data,
  linkClassName,
  spanClassName,
}: SpanListProps) {
  return (
    <>
      {data.map((item, i) => (
        <Link
          key={item.name}
          className={linkClassName}
          to={paths.artist(item.id)}
        >
          <span className={spanClassName}>
            {item.name}
            {i === data.length - 1 ? "" : ", "}
          </span>
        </Link>
      ))}
    </>
  );
}
