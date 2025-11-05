import Loader from "@/components/Loader"


const loading = () => {
  return (
    <div className="h-dvh fixed inset-0 m-auto w-full flex items-center justify-center">
    <Loader/>
    </div>
  )
}

export default loading
