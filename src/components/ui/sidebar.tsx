import { Home, Settings, Plus } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6">
      <Plus className="cursor-pointer hover:text-gray-300" />
      <Home className="cursor-pointer hover:text-gray-300" />
      <Settings className="cursor-pointer hover:text-gray-300 mt-auto mb-4" />
    </div>
  )
}