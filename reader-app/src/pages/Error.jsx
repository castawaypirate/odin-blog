import { useRouteError } from "react-router";

export default function Error() {
  const error = useRouteError();
  return (
    <div>
      <h1>Error</h1>
      <h3>{error.status ? `Error status:${error.status}` : error.message}</h3>
    </div>
  );
}
