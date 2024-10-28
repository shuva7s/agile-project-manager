import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <main className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </main>
  )
}

export default Loading