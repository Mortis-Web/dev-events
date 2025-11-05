import Loader from "@/components/loader";

const loading = () => {
  return (
    <div className="fixed inset-0 m-auto flex h-dvh w-full items-center justify-center">
      <Loader />
    </div>
  );
};

export default loading;
