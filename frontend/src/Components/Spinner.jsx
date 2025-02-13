import Spinner from "react-bootstrap/Spinner";

export default function LoadingSpinner() {
  return (
    <>
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        variant="light"
      />
    </>
  );
}
