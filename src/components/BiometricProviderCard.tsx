import { BarChart2, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import { BiometricProvider } from '../lib/biometricProviders';
import { BiometricConnection } from '../interfaces/interfaces';
import { format } from 'date-fns';

interface BiometricProviderCardProps {
  provider: BiometricProvider;
  connection?: BiometricConnection;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
}
export const BiometricProviderCard = ({
  provider,
  connection,
  onConnect,
  onDisconnect,
  onSync
}: BiometricProviderCardProps) => {
  const Icon = provider.icon;

  return (
    <div className="border rounded-lg p-6 hover:border-rose-200 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-rose-50 rounded-lg">
            <Icon className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {provider.name}
            </h3>
            <p className="text-gray-600 mt-1">{provider.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <BarChart2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                Tracks: {provider.metrics.join(', ')}
              </span>
            </div>
            {connection?.last_sync_at && (
              <div className="text-sm text-gray-500 mt-2">
                Last synced: {format(new Date(connection.last_sync_at), 'MMM d, yyyy HH:mm')}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {connection ? (
            <>
              <button onClick={onSync} className="p-2 text-gray-400 hover:text-gray-600" title="Sync data">
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={onDisconnect}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
                <span>Disconnect</span>
              </button>
            </>
          ) : (
            <button
              onClick={onConnect}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Connect</span>
            </button>
          )}
        </div>
      </div>

      {connection && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Connected Features</h4>
          <div className="grid grid-cols-2 gap-4">
            {provider.metrics.map((metric: string) => (
              <div key={metric} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">{metric}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
