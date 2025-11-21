import DashboardContent from "../components/DashboardContent"
import SideBar from "../components/SideBar"


const DashboardPage = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar/>
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <DashboardContent/>
      </main>
    </div>
  )
}

export default DashboardPage
