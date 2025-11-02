import Loader from "@/components/loader";

const loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Loader />
    </div>
  );
};

export default loading;
