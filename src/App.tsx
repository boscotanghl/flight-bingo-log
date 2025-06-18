import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

// Define TypeScript interface for your flight data
interface Flight {
  Id: number
  name: string
  arrival: string // Assuming this is a ISO string or timestamp
}

export default function App() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: supabaseError } = await supabase
          .from('flight-logs-test')
          .select('*')
          .order('arrival', { ascending: false })

        if (supabaseError) {
          throw supabaseError
        }

        if (!data) {
          throw new Error('No data returned from query')
        }

        setFlights(data)
      } catch (err) {
        console.error('Error fetching flights:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch flights')
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [])

  return (
    <div className="app-container">
      <header className="header">
        <h1>Flight Logs</h1>
        <p className="subtitle">Recent arrivals at a glance</p>
      </header>

      <main className="content">
        <div className="glass-panel">
          {loading ? (
            <div className="loader">Loading flights...</div>
          ) : error ? (
            <div className="error-message">
              Error: {error}
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : flights.length === 0 ? (
            <div className="no-flights">No flight records found</div>
          ) : (
            <table className="flight-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Flight Name</th>
                  <th>Arrival Time</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.Id}>
                    <td>{flight.Id}</td>
                    <td>{flight.name}</td>
                    <td>
                      {flight.arrival ?
                        new Date(flight.arrival).toLocaleString() :
                        'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="future-actions">
          <p>Future features: Add, Edit, and Delete flights (coming soon)</p>
        </div>
      </main>
    </div>
  )
}