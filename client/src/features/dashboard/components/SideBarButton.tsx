import { Button } from "@/components/ui/button"

export interface ButtonProps{
    Label: string;
}

const SideBarButton = ({Label}:ButtonProps) => {
  return (
    <Button className="rounded-md bg-green-300">
        {Label}
    </Button>
  )
}

export default SideBarButton