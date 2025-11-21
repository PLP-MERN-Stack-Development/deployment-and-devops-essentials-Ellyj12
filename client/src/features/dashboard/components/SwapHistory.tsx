import type { Swap } from "../api/dashboard.types";

interface SwapHistoryProps {
  swaps: Swap[];
  user: { username: string } | null;
  onViewSwap: (swap: Swap) => void;
}

export const SwapHistory = ({ swaps, user, onViewSwap }: SwapHistoryProps) => {
  return (
    <section id="myRequests">
      <h2 className="text-2xl font-bold mb-4">Swap History</h2>
      {swaps.length === 0 ? (
        <p className="text-gray-500">No swap history.</p>
      ) : (
        <div className="space-y-4">
          {swaps.map((swap) => (
            <div 
              key={swap._id} 
              className="bg-white p-4 rounded-lg shadow border cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onViewSwap(swap)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    Swap with {swap.initiator.username === user?.username ? swap.owner.username : swap.initiator.username}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                     {new Date(swap.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  swap.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  swap.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  swap.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {swap.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
